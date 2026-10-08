#!/usr/bin/env python3
"""Cut the frozen NECTAR handoff down to what the wiki page can carry.

The handoff (references/drylab/patrick, gitignored, ~450 MB) is the archival
source. The wiki build has a 5 MB ceiling, so this script writes two things
into src/data/nectar/:

    panel.json          all 100 panel genes, index-level metadata
    <gene_id>.json      one file per featured gene, the full depth the page shows

NOTHING IS RECOMPUTED, RESCORED OR NORMALISED. Values are copied across as
stored. The one transformation is display rounding, and only on the two series
the page draws as curves: per-guide layer percentiles and per-region Combined
Evidence scores are stored as integers 0-1000 (value x 1000, rounded), because
those are plotted at roughly one point per screen pixel and the full float
would cost about five times the bytes. Every number the page prints as a
number, rather than draws as a curve, is copied at full stored precision.

The featured genes are the five literature-arm genes: the panel members with
published direct Varroa RNAi evidence, all with complete design and complete
specificity chains. Their names are public because the studies are public; the
team's own selected target is not named here or anywhere on the wiki.

Run from the repo root with the handoff present:

    python tools/nectar_distil.py
"""

import json
import pathlib
import sys
from collections import Counter

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "references" / "drylab" / "patrick"
OUT = ROOT / "src" / "data" / "nectar"

# The experimental literature arm, as named in the handoff README.
FEATURED = [
    "LOC111244764",  # Vd-CHIBIN / Pero
    "LOC111247660",  # Vd40090 / NP1
    "LOC111247342",  # Vd74517 / NP5 / NPC2
    "LOC111255436",  # Vd-CHIsal
    "LOC111249228",  # VdCHH
]

# How many ranked rows per metric the page can show, and how many regions it
# lets a reader select. The rest stays in the handoff.
TOP_GUIDES = 12
TOP_REGIONS = 12

# The longest exact-match events a selectable region carries into the file.
EVENTS_PER_REGION = 40

# Full-precision candidate columns the guide inspector prints.
GUIDE_COLS = [
    "start_1based",
    "end_1based",
    "target_sequence_dna",
    "antisense_guide_sequence_rna",
    "overlap_regions",
    "crosses_annotation_boundary",
    "layer1_accumulation_linear_predictor",
    "layer1_accumulation_percentile",
    "guide_5p_terminal_dg_4bp",
    "passenger_5p_terminal_dg_4bp",
    "asymmetry_ddg_4bp",
    "asymmetry_ddg_5bp",
    "guide_self_fold_mfe_kcal_mol",
    "guide_self_fold_structure",
    "layer2_asymmetry_percentile",
    "layer2_self_fold_percentile",
    "layer2_reference_score",
    "target_whole_p_unpaired",
    "target_seed_g2_8_p_unpaired",
    "layer3_whole_accessibility_percentile",
    "layer3_seed_accessibility_percentile",
    "layer3_reference_score",
    "stage10_layer1_percentile",
    "stage10_layer2_percentile",
    "stage10_layer3_percentile",
    "stage10_equal_layer_score",
    "stage10_equal_layer_rank",
    "stage10_equal_layer_percentile",
    "stage10_pareto_front",
    "stage10_minimum_layer_score",
]

GUIDE_SPEC_COLS = [
    "exact_warning_tier",
    "offtarget_exact_event_count",
    "offtarget_longest_exact_match_nt",
    "offtarget_unique_gene_count",
    "offtarget_unique_transcript_count",
    "same_gene_other_transcript_event_count",
    "varroa_offtarget_exact_event_count",
    "apis_offtarget_exact_event_count",
    "full_canonical_guide_exact_match",
]

# An exact-match event, as the page needs it. The off-target it hit is held
# once in `offtargets` and referenced by index: a region of a chitinase can hit
# the same Apis transcript from thirty overlapping windows, and spelling out
# the accession, gene symbol and product each time is most of the file.
EVENT_COLS = [
    "exact_match_length_nt",
    "exact_warning_tier",
    "counts_as_offtarget_warning",
    "relationship_to_intended_target",
    "query_orientation",
    "target_match_start_1based",
    "target_match_end_1based",
]

OFFTARGET_COLS = [
    "reference_species",
    "offtarget_gene_symbol",
    "offtarget_gene_id",
    "offtarget_product",
    "offtarget_transcript_accession",
]

HOMOLOGY_COLS = [
    "candidate_region_id",
    "reference_species",
    "offtarget_gene_symbol",
    "offtarget_product",
    "offtarget_transcript_accession",
    "relationship_to_intended_target",
    "query_coverage_fraction",
    "whole_region_identity_fraction",
    "homology_mismatch_count",
    "homology_insertion_count",
    "homology_deletion_count",
    "homology_longest_exact_run_nt",
    "literature_high_homology_flag",
]

LITERATURE_FIELDS = [
    "literature_gene_label",
    "literature_legacy_aliases",
    "literature_delivery_route",
    "literature_evidence_classes",
    "literature_knockdown_summary",
    "literature_knockdown_verified",
    "literature_phenotype_summary",
    "literature_phenotype_categories",
    "literature_phenotype_significant",
    "literature_study_scale",
    "literature_individual_vs_cocktail",
    "literature_identifier_status",
    "literature_mapping_method",
    "literature_replication_note",
    "literature_record_id",
    "literature_reference_id",
    "literature_transcript_accession",
    "literature_protein_accession",
    "reference_first_author",
    "reference_publication_year",
    "reference_title",
    "reference_journal",
    "reference_doi",
    "reference_pmid",
    "reference_pmcid",
    "reference_primary_url",
    "secondary_reference_url",
    "retrieved_on",
]


def trim(summary_rows):
    """Drop the target_id each summary row repeats; the file names it once."""
    return [{k: v for k, v in r.items() if k != "target_id"} for r in summary_rows]


def rows_as_dicts(table):
    cols = table["columns"]
    return [dict(zip(cols, row)) for row in table["rows"]]


def pick(record, keys):
    return {k: record.get(k) for k in keys}


def milli(value):
    """A 0-1 score as an integer 0-1000. Display rounding, for curves only."""
    return round(value * 1000)


def summarise(values):
    """Min, median and max of a stored series, at stored precision."""
    ordered = sorted(values)
    middle = len(ordered) // 2
    return {
        "min": ordered[0],
        "median": ordered[middle],
        "max": ordered[-1],
    }


def distil_panel(index):
    out = []
    for g in index["genes"]:
        out.append(
            {
                "panelIndex": g["panel_index"],
                "geneId": g["gene_id"],
                "geneLabel": g["gene_label"],
                "productLabel": g["product_label"],
                "accession": g["transcript_accession"],
                "lengthNt": g["transcript_length_nt"],
                "route": g["selection_route"],
                "designStatus": g["design_status"],
                "specificityStatus": g["specificity_status"],
                "candidates23": g["candidate_counts"]["23"],
                "candidates24": g["candidate_counts"]["24"],
                "regionCount": g["region_count_96nt"],
                "networkRank": g["network_record_rank"] or None,
                "abundanceRank": g["abundance_rank"] or None,
                "abundanceQuintile": g["abundance_quintile"] or None,
                "dsripTransferCount": g["dsrip_transfer_count"] or None,
                "literatureClass": g["literature_evidence_class"] or None,
                "inCatalogue": g["in_gene_catalogue"] == "yes",
                "exactEventsTotal": g["exact_event_total"],
                "exactEventsVarroa": g["exact_events_varroa"],
                "exactEventsApis": g["exact_events_apis"],
                "topRegion24": {
                    "start": g["top_region_24nt_combined_evidence"]["start_1based"],
                    "end": g["top_region_24nt_combined_evidence"]["end_1based"],
                    "score": g["top_region_24nt_combined_evidence"]["score"],
                },
                "hasWarnings": g["has_warnings"],
            }
        )
    return out


def distil_gene(gene_id):
    gene = json.loads((SRC / "data" / "genes" / f"{gene_id}.json").read_text())
    spec = json.loads((SRC / "data" / "specificity" / f"{gene_id}.json").read_text())

    design = gene["design"]
    candidates = rows_as_dicts(design["candidates"])
    sel = gene["selection"]
    evidence = gene["gene_evidence"] or {}

    tracks = {}
    top_guides = {}
    for length in ("23", "24"):
        own = sorted(
            (c for c in candidates if str(c["candidate_length_nt"]) == length),
            key=lambda c: c["start_1based"],
        )
        tracks[length] = {
            "firstStart": own[0]["start_1based"],
            "l1": [milli(c["stage10_layer1_percentile"]) for c in own],
            "l2": [milli(c["stage10_layer2_percentile"]) for c in own],
            "l3": [milli(c["stage10_layer3_percentile"]) for c in own],
            "total": [milli(c["stage10_equal_layer_score"]) for c in own],
        }
        # Twenty bins of Combined Evidence, counted from the stored floats. The
        # three layer values are percentiles within this transcript, so their own
        # distributions are flat by construction and there is nothing to plot;
        # the equal-thirds combination of three correlated percentiles is not.
        bins = [0] * 20
        for c in own:
            bins[min(19, int(c["stage10_equal_layer_score"] * 20))] += 1
        tracks[length]["totalHistogram"] = bins
        # Min, median and max from the stored floats, so the page never quotes a
        # statistic it derived from the rounded curve above.
        tracks[length]["stats"] = {
            key: summarise([c[column] for c in own])
            for key, column in (
                ("l1", "stage10_layer1_percentile"),
                ("l2", "stage10_layer2_percentile"),
                ("l3", "stage10_layer3_percentile"),
                ("total", "stage10_equal_layer_score"),
            )
        }
        best = sorted(own, key=lambda c: -c["stage10_equal_layer_score"])[:TOP_GUIDES]
        top_guides[length] = [pick(c, GUIDE_COLS) for c in best]

    # Specificity rows for exactly those guides, keyed by start position.
    guide_spec = {}
    if spec["status"] == "complete":
        for length in ("23", "24"):
            table = {
                r["start_1based"]: r
                for r in rows_as_dicts(spec["candidate_specificity"][length])
            }
            guide_spec[length] = {
                str(g["start_1based"]): pick(table[g["start_1based"]], GUIDE_SPEC_COLS)
                for g in top_guides[length]
                if g["start_1based"] in table
            }

    region_tracks = {}
    top_regions = {}
    for length in ("23", "24"):
        metrics = design["regions"][length]
        rows = sorted(
            rows_as_dicts(metrics["total"]), key=lambda r: r["region_start_1based"]
        )
        region_tracks[length] = {
            "firstStart": rows[0]["region_start_1based"],
            "total": [milli(r["region_score"]) for r in rows],
        }
        top_regions[length] = {}
        for metric in ("layer1", "layer2", "layer3", "total"):
            ranked = sorted(
                rows_as_dicts(metrics[metric]), key=lambda r: r["region_rank"]
            )[:TOP_REGIONS]
            top_regions[length][metric] = [
                {
                    "start": r["region_start_1based"],
                    "end": r["region_end_1based"],
                    "guides": r["contained_window_count"],
                    "score": r["region_score"],
                    "rank": int(r["region_rank"]),
                    "feature": r["start_feature"],
                }
                for r in ranked
            ]

    # The page lets a reader select any region it ranks, under any of the four
    # metrics and either guide length, so every one of those needs its
    # specificity row and the exact events the row points at. The four metrics
    # often agree, so the union is far smaller than four times the list.
    selectable = sorted(
        {
            r["start"]
            for length in ("23", "24")
            for metric in ("layer1", "layer2", "layer3", "total")
            for r in top_regions[length][metric]
        }
    )
    region_spec = {}
    events = []
    offtargets = []
    homology = []
    homology_summary = []
    length_histogram = {}
    if spec["status"] == "complete":
        by_start = {
            r["start_1based"]: r for r in rows_as_dicts(spec["region_specificity"])
        }
        # A conserved region can carry over a thousand exact-match events, more
        # than any table on a page can say anything with. Each region keeps its
        # longest matches, which are the ones a safety screen is read for, and
        # the page prints the stored total beside them so the truncation is
        # visible rather than implied. The counts themselves are never derived
        # from this list: they come from the stored region row above.
        longest_first = {
            e["exact_event_id"]: (-e["exact_match_length_nt"], e["exact_event_id"])
            for e in rows_as_dicts(spec["exact_events"])
        }
        wanted_events = set()
        for start in selectable:
            row = by_start.get(start)
            if not row:
                continue
            stored = row.get("source_exact_event_ids") or []
            ids = sorted(stored, key=lambda i: longest_first[i])[:EVENTS_PER_REGION]
            region_spec[str(start)] = {
                "eventsStored": len(stored),
                "start": row["start_1based"],
                "end": row["end_1based"],
                "tier": row["region_exact_warning_tier"],
                "events": row["region_offtarget_exact_event_count"],
                "varroaEvents": row["varroa_offtarget_exact_event_count"],
                "apisEvents": row["apis_offtarget_exact_event_count"],
                "varroaTier": row["varroa_exact_warning_tier"],
                "apisTier": row["apis_exact_warning_tier"],
                "longestExactNt": row["region_offtarget_longest_exact_match_nt"],
                "uniqueGenes": row["region_offtarget_unique_gene_count"],
                "uniqueTranscripts": row["region_offtarget_unique_transcript_count"],
                "eventRows": ids,
            }
            wanted_events.update(ids)

        all_events = rows_as_dicts(spec["exact_events"])
        seen = {}
        index_of_event = {}
        for event in all_events:
            if event["exact_event_id"] not in wanted_events:
                continue
            key = tuple(event[c] for c in OFFTARGET_COLS)
            if key not in seen:
                seen[key] = len(offtargets)
                offtargets.append(dict(zip(OFFTARGET_COLS, key)))
            row = pick(event, EVENT_COLS)
            row["offtarget"] = seen[key]
            index_of_event[event["exact_event_id"]] = len(events)
            events.append(row)

        # Regions point at their events by position in `events`, not by id.
        for row in region_spec.values():
            row["eventRows"] = [
                index_of_event[i] for i in row["eventRows"] if i in index_of_event
            ]

        # Every event counts towards the histogram, not only the selectable ones:
        # it is the gene-level result, and it is what separates the two species.
        for species in ("Varroa destructor", "Apis mellifera"):
            counts = Counter(
                e["exact_match_length_nt"]
                for e in all_events
                if e["reference_species"] == species
            )
            length_histogram[species] = sorted(counts.items())

        selectable_ids = {
            f"{gene['target']['target_id']}__region96nt__{s:04d}_{s + 95:04d}"
            for s in selectable
        }
        hits = rows_as_dicts(spec["homology_hits"])
        homology = [
            pick(h, HOMOLOGY_COLS)
            for h in hits
            if h["candidate_region_id"] in selectable_ids
        ]
        for screen in spec["reference_screens"]:
            qc = screen.get("homology_refinement_qc") or {}
            homology_summary.append(
                {
                    "species": screen["scientific_name"],
                    "assembly": screen["assembly_accession"],
                    "assemblyName": screen["assembly_name"],
                    "exactEvents": screen["exact_match_event_count"],
                    "exactStatus": screen["exact_match_screen_status"],
                    "homologyStatus": screen["homology_refinement_status"],
                    "homologyHits": qc.get("homology_hit_count"),
                    "alignmentsAttempted": qc.get("alignments_attempted"),
                    "retrievalCandidates": qc.get("retrieval_candidate_count"),
                    "seedEvents": qc.get("ot2_source_event_count"),
                    "limitation": qc.get("candidate_discovery_limitation"),
                }
            )

    literature = [
        pick(o, LITERATURE_FIELDS)
        for o in (evidence.get("direct_varroa_rnai") or {}).get("observations", [])
    ]

    return {
        "geneId": gene["gene_id"],
        "geneLabel": gene["gene_label"],
        "productLabel": gene["product_label"],
        "accession": gene["transcript_accession"],
        "lengthNt": gene["transcript_length_nt"],
        "designRoute": gene["design_route"],
        "metricLabels": gene["metric_labels"],
        "selection": {
            "route": sel["selection_route"],
            "networkRank": sel["network_record_rank"] or None,
            "networkPercentile": sel["network_percentile"] or None,
            "abundanceRank": sel["abundance_rank"] or None,
            "abundancePercentile": sel["abundance_percentile"] or None,
            "abundanceQuintile": sel["abundance_quintile"] or None,
            "dsripTransferCount": sel["dsrip_transfer_count"] or None,
            "literatureClass": sel["literature_evidence_class"] or None,
            "transcriptReason": sel["transcript_selection_reason"],
            "alternativeNote": sel["alternative_transcript_note"],
            "inCatalogue": sel["in_gene_catalogue"] == "yes",
            "warnings": sel["warnings"] or None,
        },
        "literature": literature,
        "expression": (
            evidence.get("expression")
            if (evidence.get("expression") or {}).get("status") == "available"
            else None
        ),
        "network": (
            evidence.get("network_connectivity")
            if (evidence.get("network_connectivity") or {}).get("status")
            not in (None, "not_represented")
            else None
        ),
        "sequence": gene["target"]["transcript_sequence"],
        "sequenceSha256": gene["target"]["transcript_sequence_sha256"],
        "annotations": [
            {
                "feature": a["feature"],
                "start": a["start_1based"],
                "end": a["end_1based"],
            }
            for a in gene["target"]["annotations"]
        ],
        "counts": {k: v for k, v in gene["candidate_counts"].items()},
        "regionLengthNt": design["region_length_nt"],
        "tracks": tracks,
        "regionTracks": region_tracks,
        "topGuides": top_guides,
        "guideSpecificity": guide_spec,
        "topRegions": top_regions,
        "regionSpecificity": region_spec,
        "events": events,
        "offtargets": offtargets,
        "eventLengthHistogram": length_histogram,
        "homologyHits": homology,
        "homologyScreens": homology_summary,
        "exactMatchSummary": spec["exact_match_summary"],
        "exactEventTotal": spec["exact_event_total"],
        "specificityStatus": spec["status"],
        "summaries": {
            "pareto": trim(design["summaries"]["pareto_summary"]),
            "layerCorrelations": trim(
                design["summaries"]["layer_correlations_stage10"]
            ),
            "layer2Correlations": trim(design["summaries"]["layer2_correlations"]),
            "layer3Correlations": trim(design["summaries"]["layer3_correlations"]),
        },
        "runParameters": design["run_parameters"],
    }


def main():
    if not SRC.exists():
        sys.exit(f"handoff not found at {SRC}")
    OUT.mkdir(parents=True, exist_ok=True)
    index = json.loads((SRC / "data" / "index.json").read_text())
    provenance = json.loads((SRC / "provenance.json").read_text())
    manifest = json.loads((SRC / "manifest.json").read_text())

    # The construct builder wraps the best region of a featured gene, and that
    # is all it needs from the gene: 96 nt each, so it is carried in the panel
    # file rather than making the builder pull a 300 KB gene file to read them.
    best_regions = {}
    for gene_id in FEATURED:
        gene = json.loads((SRC / "data" / "genes" / f"{gene_id}.json").read_text())
        table = gene["design"]["regions"]["24"]["total"]
        row = min(table["rows"], key=lambda r: r[table["columns"].index("region_rank")])
        start = row[table["columns"].index("region_start_1based")]
        end = row[table["columns"].index("region_end_1based")]
        best_regions[gene_id] = {
            "start": start,
            "end": end,
            "score": row[table["columns"].index("region_score")],
            "feature": row[table["columns"].index("start_feature")],
            "sequence": gene["target"]["transcript_sequence"][start - 1 : end],
        }

    panel = {
        "schemaVersion": index["schema_version"],
        "transcriptStatement": index["transcript_statement"],
        "provenance": {
            "runDateUtc": provenance["run_date_utc"],
            "nectarCleanCommit": provenance["nectar_clean"]["commit"],
            "nectarCleanCommitSubject": provenance["nectar_clean"]["commit_subject"],
            "panelFile": provenance["frozen_panel"]["file"],
            "panelSha256": provenance["frozen_panel"]["sha256"],
            "viennaRna": provenance["environment"]["ViennaRNA_RNAfold"],
            "bowtie": "bowtie 1.3.1",
            "edlib": provenance["environment"]["packages"]["edlib"],
            "python": provenance["environment"]["python"],
        },
        "featured": FEATURED,
        "bestRegions": best_regions,
        "genes": distil_panel(index),
    }
    write(OUT / "panel.json", panel)

    for gene_id in FEATURED:
        write(OUT / f"{gene_id}.json", distil_gene(gene_id))

    total = sum(f.stat().st_size for f in OUT.glob("*.json"))
    print(f"\n{len(FEATURED) + 1} files, {total / 1024:.0f} KB total")
    # manifest is read only to confirm the handoff we distilled is the frozen one
    print(f"handoff run: {manifest.get('generated_utc', provenance['run_date_utc'])}")


def write(path, payload):
    path.write_text(json.dumps(payload, separators=(",", ":")) + "\n")
    print(f"{path.name:28} {path.stat().st_size / 1024:8.1f} KB")


if __name__ == "__main__":
    main()
