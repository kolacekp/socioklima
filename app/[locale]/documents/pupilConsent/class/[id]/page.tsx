import { prisma } from '@/lib/prisma';
import ContentNotAllowed from '../../../../dashboard/components/contentNotAllowed';
import dynamic from 'next/dynamic';

const PupilConsent = dynamic(() => import('../../pupilConsent'), {
  ssr: false
});

export default async function PupilConsentPdfClass({ params }: { params: { id: string } }) {
  const pupils = await prisma.pupil.findMany({
    where: {
      class: {
        id: params.id
      }
    },
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

  if (!pupils.length) return <ContentNotAllowed />;

  return <PupilConsent pupils={pupils} />;
}
