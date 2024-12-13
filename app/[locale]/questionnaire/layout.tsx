import FlowbiteContext from '../../context/flowbiteContext';
import { SidebarProvider } from '../../context/sidebarContext';
import NextAuthProvider from '../dashboard/components/nextAuthProvider';

export default async function QuestionnaireLayout({ children }: { children: React.ReactNode }) {
  return (
    <FlowbiteContext>
      <NextAuthProvider>
        <SidebarProvider>{children}</SidebarProvider>
      </NextAuthProvider>
    </FlowbiteContext>
  );
}
