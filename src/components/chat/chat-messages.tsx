"use client";

import ChatItem from "@/components/chat/chat-item";
import ChatWelcome from "@/components/chat/chat-welcome";
import { useChatQuery } from "@/hooks/use-chat-query";
import { Member, Message, Profile } from "@prisma/client";
import { format } from 'date-fns';
import { Loader2, ServerCrash } from "lucide-react";
import { Fragment } from "react";

const DATE_FORMAT = "yyyy MMM d, HH:mm"
type MessageWithMemberWithhProfile = Message & {
    member: Member & {
        profile: Profile
    }
}

type ChatMessagesProps = {
    name: string;
    member: Member;
    chatId: string;
    apiUrl: string;
    socketUrl: string;
    socketQuery: Record<string, string>;
    paramKey: "channelId" | "conversationId";
    paramValue: string;
    type: "channel" | "conversation";
};
const ChatMessages = ({
    name,
    member,
    chatId,
    apiUrl,
    socketQuery,
    socketUrl,
    paramKey,
    paramValue,
    type,
}: ChatMessagesProps) => {
    const queryKey = `chat:${chatId}`;

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
        useChatQuery({
            queryKey,
            apiUrl,
            paramKey,
            paramValue,
        });
    
    if (status === 'pending') {
        return (
            <div className='flex flex-col flex-1 justify-center items-center'>
                <Loader2 className='h-7 w-7 text-zinc-500 animate-spin my-4' />
                <p className='text-xm text-zinc-500 dark:text-zinc-400'>
                    Loading messages...
                </p>
            </div>
        )
    } 

    if (status === 'error') {
        return (
            <div className='flex flex-col flex-1 justify-center items-center'>
                <ServerCrash className='h-7 w-7 text-zinc-500 my-4' />
                <p className='text-xm text-zinc-500 dark:text-zinc-400'>
                    Something went wrong
                </p>
            </div>
        )
    } 
    
    return (
        <div className="flex-1 flex flex-col py-4 overflow-y-auto">
            <div className="flex-1" />
            <ChatWelcome
                type={type}
                name={name}
            />
            <div className='flex flex-col-reverse mt-auto'>
                {data?.pages?.map((group, i) => (
                    <Fragment key={i}>
                        {group.items.map((message: MessageWithMemberWithhProfile) => (
                            <ChatItem
                                key={message.id}
                                id={message.id}
                                currentMember={member}
                                member={message.member}
                                content={message.content}
                                fileUrl={message.fileUrl}
                                deleted={message.deleted}
                                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                                isUpdated={message.updatedAt !== message.createdAt}
                                socketUrl={socketUrl}
                                socketQuery={socketQuery}
                             />
                        ))}
                    </Fragment>
                ))}
            </div>
        </div>
    );
};
export default ChatMessages;