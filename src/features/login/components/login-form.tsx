import { useForm, useFormState } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import type { InstanceCredentials } from '@/entities/instance';

import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/shared/ui/form';
import { loginCredentials } from '../login.schema';

type LoginFormProps = {
  onSuccess: (credentials: InstanceCredentials) => Promise<void>;
};

export function LoginForm({ onSuccess }: LoginFormProps) {
  const form = useForm<InstanceCredentials>({
    resolver: zodResolver(loginCredentials),
    defaultValues: {
      idInstance: '',
      apiTokenInstance: '',
    },
  });

  const { isSubmitting } = useFormState({
    control: form.control,
  });

  const onSubmit = async (credentials: InstanceCredentials) => {
    try {
      await onSuccess(credentials);
    } catch {
      return;
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Вход</CardTitle>
        <CardDescription>Введите ваши idInstance и apiTokenInstance</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">
            <fieldset disabled={isSubmitting} className="space-y-6 group-disabled:opacity-50">
              <FormField
                control={form.control}
                name="idInstance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>idInstance</FormLabel>

                    <FormControl>
                      <Input placeholder="Ваш idInstance" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="apiTokenInstance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>apiTokenInstance</FormLabel>

                    <FormControl>
                      <Input placeholder="Ваш apiTokenInstance" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                Login
              </Button>
            </fieldset>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
