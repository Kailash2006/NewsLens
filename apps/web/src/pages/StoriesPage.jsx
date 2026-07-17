import { api } from '../api/client.js';
import { useAsync } from '../hooks/useAsync.js';
import StoryCluster from '../components/StoryCluster.jsx';
import { Loading, ErrorBlock, SectionTitle } from '../components/StateBlocks.jsx';

export default function StoriesPage() {
  const { data, error, loading } = useAsync(() => api.stories(), []);

  return (
    <div>
      <SectionTitle eyebrow="Multi-source" title="Same story, every angle" />
      <p className="-mt-2 mb-6 max-w-2xl text-sm text-slate-400">
        Each story clusters coverage from multiple outlets so you can compare how different
        publications frame the same facts. The spread bar shows the political range of the coverage.
      </p>

      {loading && <Loading label="Clustering coverage…" />}
      {error && <ErrorBlock error={error} />}
      {data && (
        <div className="grid gap-5">
          {data.items.map((cluster) => (
            <StoryCluster key={cluster.id} cluster={cluster} />
          ))}
        </div>
      )}
    </div>
  );
}
