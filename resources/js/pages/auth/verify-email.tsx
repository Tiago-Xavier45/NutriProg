import { Head } from '@inertiajs/react';
import TextLink from '@/components/text-link';
import { logout } from '@/routes';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <>
            <Head title="Verificação de email" />

            {status === 'Link de verificação enviado' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    Um novo link de verificação foi enviado para o endereço de e-mail
                    que você forneceu durante o cadastro.
                </div>
            )}

            <div className="space-y-6 text-center">
                <p className="text-sm text-muted-foreground">
                    A verificação de e-mail está temporariamente desativada.
                </p>
                <TextLink
                    href={logout()}
                    className="mx-auto block text-sm"
                >
                    Sair
                </TextLink>
            </div>
        </>
    );
}

VerifyEmail.layout = {
    title: 'Verificar e-mail',
    description: 'Por favor, verifique seu endereço de e-mail.',
};