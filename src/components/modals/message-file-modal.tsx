'use client';

import FileUpload from '@/components/file-upload';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem
} from '@/components/ui/form';
import { useModal } from "@/hooks/use-modal-store";

import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useRouter } from "next/navigation";
import queryString from "query-string";
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
    fileUrl: z.string().min(1, {
        message: 'Attachment is required.',
    }),
});

const MessageFileModal = () => {
    const { isOpen, onClose, type, data} = useModal()
    const { apiUrl, query } = data
    const router = useRouter();

    const isModalOpen = isOpen && type === 'messageFile'

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            fileUrl: '',
        },
    });

    const isLoading = form.formState.isSubmitting;

    const handleClose = () => {
        form.reset(),
        onClose()
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = queryString.stringifyUrl({
                url: apiUrl || "",
                query
            })

            await axios.post(url, {
                ...values,
                content: values.fileUrl
            })

            form.reset();
            router.refresh()
            handleClose();
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Add an attachment
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Send a file as a message
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <div className="space-y-8 px-6">
                            <div className="flex items-center justify-center text-center">
                                <FormField
                                    control={form.control}
                                    name="fileUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <FileUpload 
                                                    endpoint="messageFile"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button disabled={isLoading} variant="primary">
                                Send
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
export default MessageFileModal;