import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { Landing } from '@/screens/Landing';
import { TargetIntake } from '@/screens/TargetIntake';
import { RunConfiguration } from '@/screens/RunConfiguration';
import { TargetDiscovery } from '@/screens/TargetDiscovery';
import { FoldingScreen } from '@/screens/FoldingScreen';
import { OffTargetScreening } from '@/screens/OffTargetScreening';
import { CassetteBuilder } from '@/screens/CassetteBuilder';
import { Export } from '@/screens/Export';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Landing />} />
          <Route path="/intake" element={<TargetIntake />} />
          <Route path="/configure" element={<RunConfiguration />} />
          <Route path="/discover" element={<TargetDiscovery />} />
          <Route path="/fold" element={<FoldingScreen />} />
          <Route path="/screen" element={<OffTargetScreening />} />
          <Route path="/cassette" element={<CassetteBuilder />} />
          <Route path="/export" element={<Export />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
