import InvitationExperience from "@/components/invitation-experience";
import { formatStudentName } from "@/lib/student-name";

type InvitationPageProps = {
  searchParams: Promise<{ studentName?: string | string[] }>;
};

/** Visit /?studentName=Ashley%20Jantjies */
export default async function InvitationPage({
                                               searchParams,
                                             }: InvitationPageProps) {
  const { studentName } = await searchParams;

  return <InvitationExperience studentName={formatStudentName(studentName)} />;
}