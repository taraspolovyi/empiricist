import { ExperimentsConfig } from '@empiricist/empiricist';

export function getUrlExperiments(): ExperimentsConfig {
  const searchParams = new URLSearchParams(window.location.search);

  const experiments: ExperimentsConfig = {};

  searchParams.forEach((value, key) => {
    experiments[key] = value;
  });

  return experiments;
}
