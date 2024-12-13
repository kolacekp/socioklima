import { prisma } from '@/lib/prisma';
import ContentNotAllowed from '../../../dashboard/components/contentNotAllowed';
import dynamic from 'next/dynamic';

const PupilConsent = dynamic(() => import('../pupilConsent'), {
  ssr: false
});

export default async function PupilConsentPdf({ params }: { params: { id: string } }) {
  const pupil = await prisma.pupil.findFirst({
    where: { id: params.id },
    include: {
      user: true,
      class: {
        include: {
          school: {
            include: {
              contactUser: true
            }
          }
        }
      }
    }
  });

  if (!pupil) return <ContentNotAllowed />;

  return <PupilConsent pupils={[pupil]} />;
}
