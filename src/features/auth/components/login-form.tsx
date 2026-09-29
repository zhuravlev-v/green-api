// import { useForm, useFormState } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Link } from 'react-router';

// import { RegisterUserBody } from '@/shared/api/generated/schemas';
// import type { RegisterRequest } from '@/shared/api/generated/models';
// import { registerUser } from '@/shared/api/generated/endpoints';

// import { Button } from '@/shared/ui/button';
// import {
//   Card,
//   CardAction,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from '@/shared/ui/card';
// import { Input } from '@/shared/ui/input';
// import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/shared/ui/form';
// import { isApiResponseError } from '@/shared/api/client/api-error';

// const RegisterField = RegisterUserBody.keyof();

// export function LoginForm() {
//   const form = useForm<RegisterRequest>({
//     resolver: zodResolver(RegisterUserBody),
//     defaultValues: {
//       username: '',
//       email: '',
//       password: '',
//     },
//   });

//   const { errors, isSubmitting } = useFormState({
//     control: form.control,
//   });

//   const hasServerErrors = Object.values(errors).some((error) => error?.type === 'server');

//   const onSubmit = async (data: RegisterRequest) => {
//     try {
//       await registerUser(data);
//     } catch (error) {
//       if (!isApiResponseError(error)) {
//         throw error;
//       }

//       for (const { field, message } of error.info.errors) {
//         const parsedField = RegisterField.safeParse(field);

//         if (!parsedField.success) {
//           continue;
//         }

//         form.setError(parsedField.data, {
//           type: 'server',
//           message,
//         });
//       }
//     }
//   };

//   return (
//     <Card className="w-full max-w-sm">
//       <CardHeader>
//         <CardTitle>Sign up new account</CardTitle>
//         <CardDescription>Enter your email, username and password</CardDescription>
//         <CardAction>
//           <Button variant="link">
//             <Link to="/dashboard">Login In</Link>
//           </Button>
//         </CardAction>
//       </CardHeader>
//       <CardContent>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">
//             <fieldset disabled={isSubmitting} className="space-y-6 group-disabled:opacity-50">
//               <FormField
//                 control={form.control}
//                 name="email"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Email</FormLabel>

//                     <FormControl>
//                       <Input placeholder="your@email.com" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="username"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Username</FormLabel>

//                     <FormControl>
//                       <Input placeholder="name" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="password"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Password</FormLabel>

//                     <FormControl>
//                       <Input
//                         placeholder="password"
//                         {...field}
//                         type="password"
//                         autoComplete="new-password"
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <Button type="submit" className="w-full" disabled={hasServerErrors}>
//                 Register
//               </Button>
//             </fieldset>
//           </form>
//         </Form>
//       </CardContent>
//     </Card>
//   );
// }

export function LoginForm() {
  return <div></div>;
}
