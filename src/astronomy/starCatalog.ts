import { createRequire } from 'node:module';
import type * as AstronomyEngine from 'astronomy-engine';
import type { CelestialBody } from './objectTypes.js';

const require = createRequire(import.meta.url);
const { Observer, Horizon } = require('astronomy-engine') as typeof AstronomyEngine;

export type StarEntry = {
  id: string;
  name: string;
  ra: number;
  dec: number;
  magnitude: number;
};

const BRIGHT_STARS: StarEntry[] = [
  { id: 'sirius', name: 'Sirius', ra: 6.7525, dec: -16.7161, magnitude: -1.46 },
  { id: 'canopus', name: 'Canopus', ra: 6.3992, dec: -52.6956, magnitude: -0.74 },
  { id: 'rigil-kentaurus', name: 'Rigil Kentaurus', ra: 14.6601, dec: -60.8339, magnitude: -0.27 },
  { id: 'arcturus', name: 'Arcturus', ra: 14.2610, dec: 19.1825, magnitude: -0.05 },
  { id: 'vega', name: 'Vega', ra: 18.6156, dec: 38.7836, magnitude: 0.03 },
  { id: 'capella', name: 'Capella', ra: 5.2782, dec: 45.9981, magnitude: 0.08 },
  { id: 'rigel', name: 'Rigel', ra: 5.2423, dec: -8.2017, magnitude: 0.13 },
  { id: 'procyon', name: 'Procyon', ra: 7.6550, dec: 5.2250, magnitude: 0.40 },
  { id: 'achernar', name: 'Achernar', ra: 1.6286, dec: -57.2367, magnitude: 0.45 },
  { id: 'betelgeuse', name: 'Betelgeuse', ra: 5.9195, dec: 7.4069, magnitude: 0.58 },
  { id: 'hadar', name: 'Hadar', ra: 14.0637, dec: -60.3731, magnitude: 0.60 },
  { id: 'altair', name: 'Altair', ra: 19.8464, dec: 8.8683, magnitude: 0.76 },
  { id: 'aldebaran', name: 'Aldebaran', ra: 4.5987, dec: 16.5092, magnitude: 0.86 },
  { id: 'acrux', name: 'Acrux', ra: 12.4433, dec: -63.0992, magnitude: 0.87 },
  { id: 'antares', name: 'Antares', ra: 16.4901, dec: -26.4319, magnitude: 0.96 },
  { id: 'spica', name: 'Spica', ra: 13.4199, dec: -11.1614, magnitude: 0.98 },
  { id: 'pollux', name: 'Pollux', ra: 7.7553, dec: 28.0261, magnitude: 1.14 },
  { id: 'fomalhaut', name: 'Fomalhaut', ra: 22.9608, dec: -29.6222, magnitude: 1.16 },
  { id: 'deneb', name: 'Deneb', ra: 20.6905, dec: 45.2803, magnitude: 1.25 },
  { id: 'mimosa', name: 'Mimosa', ra: 12.7954, dec: -59.6886, magnitude: 1.26 },
  { id: 'regulus', name: 'Regulus', ra: 10.1395, dec: 11.9672, magnitude: 1.36 },
  { id: 'adhara', name: 'Adhara', ra: 6.9771, dec: -28.9719, magnitude: 1.50 },
  { id: 'castor', name: 'Castor', ra: 7.5767, dec: 31.8883, magnitude: 1.58 },
  { id: 'shaula', name: 'Shaula', ra: 17.5601, dec: -37.1039, magnitude: 1.63 },
  { id: 'gacrux', name: 'Gacrux', ra: 12.5178, dec: -57.1133, magnitude: 1.64 },
  { id: 'bellatrix', name: 'Bellatrix', ra: 5.4189, dec: 6.3497, magnitude: 1.64 },
  { id: 'elnath', name: 'Elnath', ra: 5.4382, dec: 28.6075, magnitude: 1.65 },
  { id: 'miaplacidus', name: 'Miaplacidus', ra: 9.2200, dec: -69.7172, magnitude: 1.68 },
  { id: 'alnilam', name: 'Alnilam', ra: 5.6036, dec: -1.2019, magnitude: 1.70 },
  { id: 'al-na-ir', name: 'Al Na\'ir', ra: 22.1372, dec: -46.9611, magnitude: 1.73 },
  { id: 'alnitak', name: 'Alnitak', ra: 5.6793, dec: -1.9428, magnitude: 1.74 },
  { id: 'alioth', name: 'Alioth', ra: 12.9005, dec: 55.9597, magnitude: 1.77 },
  { id: 'mirfak', name: 'Mirfak', ra: 3.4054, dec: 49.8611, magnitude: 1.82 },
  { id: 'wezen', name: 'Wezen', ra: 7.1399, dec: -26.3933, magnitude: 1.83 },
  { id: 'alkaid', name: 'Alkaid', ra: 13.7923, dec: 49.3133, magnitude: 1.86 },
  { id: 'avior', name: 'Avior', ra: 8.3752, dec: -59.5094, magnitude: 1.86 },
  { id: 'dubhe', name: 'Dubhe', ra: 11.0621, dec: 61.7508, magnitude: 1.87 },
  { id: 'atria', name: 'Atria', ra: 16.8111, dec: -69.0278, magnitude: 1.91 },
  { id: 'alsephina', name: 'Alsephina', ra: 8.7451, dec: -54.7083, magnitude: 1.96 },
  { id: 'alphard', name: 'Alphard', ra: 9.4598, dec: -8.6586, magnitude: 1.99 },
  { id: 'polaris', name: 'Polaris', ra: 2.5303, dec: 89.2642, magnitude: 1.99 },
  { id: 'hamal', name: 'Hamal', ra: 2.1196, dec: 23.4625, magnitude: 2.01 },
  { id: 'peacock', name: 'Peacock', ra: 20.4275, dec: -56.7350, magnitude: 1.94 },
  { id: 'saiph', name: 'Saiph', ra: 5.7959, dec: -9.6697, magnitude: 2.06 },
  { id: 'rasalhague', name: 'Rasalhague', ra: 17.5823, dec: 12.5606, magnitude: 2.08 },
  { id: 'diphda', name: 'Diphda', ra: 0.7265, dec: -17.9867, magnitude: 2.04 },
  { id: 'algenib', name: 'Algenib', ra: 0.2207, dec: 15.1914, magnitude: 2.49 },
  { id: 'alpheratz', name: 'Alpheratz', ra: 0.1398, dec: 29.0906, magnitude: 2.07 },
  { id: 'mirach', name: 'Mirach', ra: 1.1619, dec: 35.6206, magnitude: 2.07 },
  { id: 'almach', name: 'Almach', ra: 2.0649, dec: 42.3297, magnitude: 2.10 },
  { id: 'caph', name: 'Caph', ra: 0.1530, dec: 59.1497, magnitude: 2.28 },
  { id: 'schedar', name: 'Schedar', ra: 0.6751, dec: 56.5372, magnitude: 2.24 },
  { id: 'navi', name: 'Navi', ra: 0.9451, dec: 60.7167, magnitude: 2.47 },
  { id: 'ruchbah', name: 'Ruchbah', ra: 1.4303, dec: 60.2353, magnitude: 2.66 },
  { id: 'kaus-australis', name: 'Kaus Australis', ra: 18.4028, dec: -34.3847, magnitude: 1.85 },
  { id: 'nunki', name: 'Nunki', ra: 18.9247, dec: -26.2968, magnitude: 2.05 },
  { id: 'ascella', name: 'Ascella', ra: 19.0411, dec: -29.8815, magnitude: 2.61 },
  { id: 'mintaka', name: 'Mintaka', ra: 5.5334, dec: -0.2992, magnitude: 2.23 },
  { id: 'kochab', name: 'Kochab', ra: 14.8442, dec: 74.1558, magnitude: 2.07 },
  { id: 'enif', name: 'Enif', ra: 21.7364, dec: 9.8750, magnitude: 2.39 },
  { id: 'scheat', name: 'Scheat', ra: 23.0629, dec: 28.0828, magnitude: 2.44 },
  { id: 'markab', name: 'Markab', ra: 23.0794, dec: 15.2053, magnitude: 2.49 },
  { id: 'sargas', name: 'Sargas', ra: 17.6108, dec: -42.9978, magnitude: 1.87 },
  { id: 'sabik', name: 'Sabik', ra: 17.1730, dec: -15.7250, magnitude: 2.43 },
  { id: 'cebalrai', name: 'Cebalrai', ra: 17.7246, dec: 4.5672, magnitude: 2.76 },
  { id: 'kornephoros', name: 'Kornephoros', ra: 16.5037, dec: 21.4897, magnitude: 2.77 },
  { id: 'zeta-her', name: 'Zeta Herculis', ra: 16.6881, dec: 31.6028, magnitude: 2.80 },
  { id: 'yed-posterior', name: 'Yed Posterior', ra: 16.3054, dec: -4.6925, magnitude: 3.23 },
  { id: 'yed-prior', name: 'Yed Prior', ra: 16.2391, dec: -3.6942, magnitude: 2.73 },
  { id: 'zeta-oph', name: 'Zeta Ophiuchi', ra: 16.6075, dec: -10.5681, magnitude: 2.56 },
  { id: 'menkar', name: 'Menkar', ra: 3.0380, dec: 4.0897, magnitude: 2.54 },
  { id: 'ankaa', name: 'Ankaa', ra: 0.4381, dec: -42.3058, magnitude: 2.39 },
  { id: 'suhail', name: 'Suhail', ra: 9.1333, dec: -43.4325, magnitude: 2.23 },
  { id: 'aspidiske', name: 'Aspidiske', ra: 9.2848, dec: -59.2753, magnitude: 2.21 },
  { id: 'naos', name: 'Naos', ra: 8.0700, dec: -40.0036, magnitude: 2.25 },
  { id: 'eta-car', name: 'Eta Carinae', ra: 10.7533, dec: -59.6886, magnitude: 4.60 },
  { id: 'lesath', name: 'Lesath', ra: 17.5189, dec: -37.3279, magnitude: 2.70 },
  { id: 'eta-sgr', name: 'Eta Sagittarii', ra: 18.2853, dec: -36.7664, magnitude: 3.18 },
  { id: 'phi-sgr', name: 'Phi Sagittarii', ra: 18.7483, dec: -27.0081, magnitude: 3.17 },
  { id: 'zeta-sgr', name: 'Zeta Sagittarii', ra: 19.0394, dec: -29.7917, magnitude: 2.60 },
  { id: 'tau-sgr', name: 'Tau Sagittarii', ra: 19.1147, dec: -27.6703, magnitude: 3.32 },
  { id: 'beta-ara', name: 'Beta Arae', ra: 17.4197, dec: -55.5331, magnitude: 2.85 },
  { id: 'gamma-ara', name: 'Gamma Arae', ra: 17.4189, dec: -56.3878, magnitude: 3.31 },
  { id: 'zeta-ara', name: 'Zeta Arae', ra: 16.8169, dec: -55.9972, magnitude: 3.12 },
  { id: 'beta-pav', name: 'Beta Pavonis', ra: 20.7417, dec: -66.2167, magnitude: 3.42 },
  { id: 'kappa-sco', name: 'Kappa Scorpii', ra: 17.7042, dec: -39.0297, magnitude: 2.41 },
  { id: 'delta-cru', name: 'Delta Crucis', ra: 12.2717, dec: -58.7481, magnitude: 2.79 },
  { id: 'epsilon-cru', name: 'Epsilon Crucis', ra: 12.3431, dec: -60.3989, magnitude: 3.59 },
  { id: 'beta-tel', name: 'Beta Telescopii', ra: 18.4436, dec: -51.2419, magnitude: 3.98 },
  { id: 'alpha-ind', name: 'Alpha Indi', ra: 20.6217, dec: -47.2911, magnitude: 3.11 },
  { id: 'alpha-tel', name: 'Alpha Telescopii', ra: 18.4452, dec: -45.9681, magnitude: 3.49 },
  { id: 'alpha-scr', name: 'Alpha Scuti', ra: 18.6053, dec: -8.2289, magnitude: 3.85 },
  { id: 'mu-vel', name: 'Mu Velorum', ra: 10.7714, dec: -49.4878, magnitude: 2.69 },
  { id: 'phi-vel', name: 'Phi Velorum', ra: 9.9500, dec: -54.5675, magnitude: 3.52 },
  { id: 'n-vel', name: 'N Velorum', ra: 9.4656, dec: -57.0092, magnitude: 3.16 },
];

export function calculateStarPositions(
  time: Date,
  lat: number,
  lon: number,
): CelestialBody[] {
  const observer = new Observer(lat, lon, 0);

  return BRIGHT_STARS.map((star) => {
    const hor = Horizon(time, observer, star.ra, star.dec);
    return {
      id: star.id,
      name: star.name,
      type: 'star' as const,
      azimuth: hor.azimuth,
      altitude: hor.altitude,
      magnitude: star.magnitude,
    };
  });
}
