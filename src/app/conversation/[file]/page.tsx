import { Conversation } from 'feature/Conversation';

export default async function ConversationPage({ params }: { params: { file: string } }) {
  return <Conversation file={decodeURI(params.file)} />;
}
