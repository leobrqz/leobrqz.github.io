import { HomePage } from '../../components/Home/HomePage';
import { pt } from '../../data/i18n';

export const metadata = { title: pt.pages.home };

export default function HomePt() {
  return <HomePage lang="pt" />;
}
