import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({ status, canResetPassword, canRegister }: Props) {
    return (
        <>
            <Head title="Entrar — NutriPro" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="contents"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-5">
                            {/* Email */}
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="email"
                                    className="text-[11px] font-medium uppercase tracking-[0.04em] text-[#555]"
                                >
                                    Endereço de email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="email@exemplo.com"
                                    className="h-[42px] rounded-sm border-[rgba(0,0,0,0.12)] bg-white text-[14px] font-light placeholder:text-[#ccc] focus-visible:border-[#6B9B5E] focus-visible:ring-[rgba(107,155,94,0.15)]"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Senha */}
                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <Label
                                        htmlFor="password"
                                        className="text-[11px] font-medium uppercase tracking-[0.04em] text-[#555]"
                                    >
                                        Senha
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            tabIndex={5}
                                            className="text-[12px] text-[#6B9B5E] hover:opacity-70"
                                        >
                                            Esqueceu a senha?
                                        </TextLink>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    className="h-[42px] rounded-sm border-[rgba(0,0,0,0.12)] bg-white text-[14px] font-light placeholder:text-[#ccc] focus-visible:border-[#6B9B5E] focus-visible:ring-[rgba(107,155,94,0.15)]"
                                />
                                <InputError message={errors.password} />
                            </div>

                            {/* Remember */}
                            <div className="flex items-center gap-2.5">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="rounded-sm border-[rgba(0,0,0,0.2)] data-[state=checked]:bg-[#3D5C33] data-[state=checked]:border-[#3D5C33]"
                                />
                                <Label
                                    htmlFor="remember"
                                    className="text-[12px] font-light text-[#888] cursor-pointer"
                                >
                                    Lembrar de mim
                                </Label>
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                                className="mt-2 h-[44px] w-full rounded-sm bg-[#3D5C33] text-[14px] font-medium tracking-wide text-white transition hover:-translate-y-px hover:bg-[#2e4526] active:translate-y-0"
                            >
                                {processing && <Spinner />}
                                Entrar
                            </Button>
                        </div>

                        {/* Register link */}
                        {canRegister && (
                            <div className="mt-5 text-center text-[13px] font-light text-[#aaa]">
                                Não tem uma conta?{' '}
                                <TextLink
                                    href={register()}
                                    tabIndex={5}
                                    className="font-normal text-[#3D5C33] hover:opacity-70"
                                >
                                    Criar conta
                                </TextLink>
                            </div>
                        )}
                    </>
                )}
            </Form>

            {status && (
                <div className="mt-4 text-center text-[13px] font-medium text-[#6B9B5E]">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Acesse sua conta',
    description: 'Insira seu email e senha para continuar',
};