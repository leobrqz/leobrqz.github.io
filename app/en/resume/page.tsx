import { ResumePage } from '@/components/Resume/ResumePage';
import { en } from '@/data/i18n';

export const metadata = { title: en.pages.resume };

export default function ResumeEn() {
  return <ResumePage lang="en" />;
}
