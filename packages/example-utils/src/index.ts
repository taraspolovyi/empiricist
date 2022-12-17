import { ExperimentsConfig } from 'empiricist';

export function getUrlExperiments(): ExperimentsConfig {
  const searchParams = new URLSearchParams(window.location.search);

  const experiments: ExperimentsConfig = {};

  searchParams.forEach((value, key) => {
    experiments[key] = value;
  });

  return experiments;
}
