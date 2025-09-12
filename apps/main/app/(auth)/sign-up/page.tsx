// "use client";

// import React, { useEffect, useActionState } from "react";
// import Link from "next/link";
// import { useFormStatus } from "react-dom";
// import { toast } from "sonner";
// import { AtSign, Lock, Loader2, Phone } from "lucide-react";

// import { Button } from "@workspace/ui/components/button";
// import { Input } from "@workspace/ui/components/input";
// import { Label } from "@workspace/ui/components/label";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@workspace/ui/components/card";
// import { signUpAction, SignUpFormState } from "./actions";

// const initialState: SignUpFormState = {
//   message: "",
//   success: false,
// };

// // Colorful SVG Icon for Google
// const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
//   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
//     <title>Google</title>
//     <path
//       d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//       fill="#4285F4"
//     />
//     <path
//       d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//       fill="#34A853"
//     />
//     <path
//       d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
//       fill="#FBBC05"
//     />
//     <path
//       d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//       fill="#EA4335"
//     />
//   </svg>
// );

// // Colorful SVG Icon for Outlook
// const OutlookIcon = (props: React.SVGProps<SVGSVGElement>) => (
//   <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
//     <title>Microsoft Outlook</title>
//     <path
//       d="M14.2,4.5H5.8C5.1,4.5,4.5,5.1,4.5,5.8v12.3c0,0.8,0.6,1.4,1.4,1.4h8.5c0.8,0,1.4-0.6,1.4-1.4V5.8 C15.6,5.1,15,4.5,14.2,4.5z"
//       fill="#0072C6"
//     />
//     <path
//       d="M19.5,8.2v7.6c0,0.8-0.6,1.4-1.4,1.4s-1.4-0.6-1.4-1.4V8.2c0-0.8,0.6-1.4,1.4-1.4S19.5,7.4,19.5,8.2z"
//       fill="#2B88D8"
//     />
//   </svg>
// );

// function SubmitButton() {
//   const { pending } = useFormStatus();

//   return (
//     <Button type="submit" className="w-full" disabled={pending}>
//       {pending ? (
//         <>
//           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//           Creating Account...
//         </>
//       ) : (
//         "Create an Account"
//       )}
//     </Button>
//   );
// }

// export default function SignUpPage() {
//   const [state, formAction] = useActionState(signUpAction, initialState);

//   useEffect(() => {
//     if (state.success) {
//       toast.success("Account Created", {
//         description: state.message,
//       });
//     } else if (state.message) {
//       toast.error("Sign-Up Failed", {
//         description: state.errors
//           ? "Please check the errors in the form."
//           : state.message,
//       });
//     }
//   }, [state]);

//   return (
//     <Card className="w-full max-w-md border-0 sm:border">
//       <CardHeader className="text-center space-y-2">
//         <CardTitle className="text-3xl font-bold tracking-tight">
//           Create an Account
//         </CardTitle>
//         <CardDescription>Get started with Payable.ai today.</CardDescription>
//       </CardHeader>
//       <CardContent className="space-y-6">
//         <div className="grid grid-cols-2 gap-4">
//           <Button
//             variant="outline"
//             onClick={() => console.log("Sign up with Google")}
//           >
//             <GoogleIcon className="mr-2 h-4 w-4" />
//             Google
//           </Button>
//           <Button
//             variant="outline"
//             onClick={() => console.log("Sign up with Outlook")}
//           >
//             <OutlookIcon className="mr-2 h-4 w-4" />
//             Outlook
//           </Button>
//         </div>

//         <div className="relative">
//           <div className="absolute inset-0 flex items-center">
//             <span className="w-full border-t" />
//           </div>
//           <div className="relative flex justify-center text-xs uppercase">
//             <span className="dark:bg-gray-900 bg-background px-2 text-muted-foreground">
//               Or sign up with email
//             </span>
//           </div>
//         </div>

//         <form action={formAction} className="space-y-6">
//           <div className="space-y-2">
//             <Label htmlFor="email">Email Address</Label>
//             <div className="relative">
//               <AtSign className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
//               <Input
//                 id="email"
//                 name="email"
//                 type="email"
//                 placeholder="you@example.com"
//                 className="pl-10"
//               />
//             </div>
//             {state.errors?.email && (
//               <p className="text-sm text-red-500 mt-1">
//                 {state.errors.email[0]}
//               </p>
//             )}
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="phone">Phone Number</Label>
//             <div className="relative">
//               <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
//               <Input
//                 id="phone"
//                 name="phone"
//                 type="tel"
//                 placeholder="+1 (555) 123-4567"
//                 className="pl-10"
//               />
//             </div>
//             {state.errors?.phone && (
//               <p className="text-sm text-red-500 mt-1">
//                 {state.errors.phone[0]}
//               </p>
//             )}
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="password">Password</Label>
//             <div className="relative">
//               <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
//               <Input
//                 id="password"
//                 name="password"
//                 type="password"
//                 placeholder="8+ characters"
//                 className="pl-10"
//               />
//             </div>
//             {state.errors?.password && (
//               <p className="text-sm text-red-500 mt-1">
//                 {state.errors.password[0]}
//               </p>
//             )}
//           </div>

//           <div>
//             <SubmitButton />
//           </div>
//         </form>
//       </CardContent>
//       <CardFooter className="flex justify-center">
//         <p className="text-sm text-muted-foreground">
//           Already have an account?{" "}
//           <Link
//             href="/sign-in"
//             passHref
//             className="font-medium text-primary hover:underline"
//           >
//             Sign In
//           </Link>
//         </p>
//       </CardFooter>
//     </Card>
//   );
// }

"use client";

import React, { useEffect, useActionState } from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { AtSign, Lock, Loader2 } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { signUpAction, SignUpFormState } from "./actions";
import { PhoneNumberInput } from "@/components/sign-up/phone-input";

const initialState: SignUpFormState = {
  message: "",
  success: false,
};

// Colorful SVG Icon for Google
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <title>Google</title>
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

// Colorful SVG Icon for Outlook
const OutlookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <title>Microsoft Outlook</title>
    <path
      d="M14.2,4.5H5.8C5.1,4.5,4.5,5.1,4.5,5.8v12.3c0,0.8,0.6,1.4,1.4,1.4h8.5c0.8,0,1.4-0.6,1.4-1.4V5.8 C15.6,5.1,15,4.5,14.2,4.5z"
      fill="#0072C6"
    />
    <path
      d="M19.5,8.2v7.6c0,0.8-0.6,1.4-1.4,1.4s-1.4-0.6-1.4-1.4V8.2c0-0.8,0.6-1.4,1.4-1.4S19.5,7.4,19.5,8.2z"
      fill="#2B88D8"
    />
  </svg>
);

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating Account...
        </>
      ) : (
        "Create an Account"
      )}
    </Button>
  );
}

export default function SignUpPage() {
  const [state, formAction] = useActionState(signUpAction, initialState);
  const [phone, setPhone] = React.useState<string | undefined>();

  useEffect(() => {
    if (state.success) {
      toast.success("Account Created", {
        description: state.message,
      });
    } else if (state.message) {
      toast.error("Sign-Up Failed", {
        description: state.errors
          ? "Please check the errors in the form."
          : state.message,
      });
    }
  }, [state]);

  return (
    <Card className="w-full max-w-md border-0 sm:border">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-3xl font-bold tracking-tight">
          Create an Account
        </CardTitle>
        <CardDescription>Get started with Payable.ai today.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            onClick={() => console.log("Sign up with Google")}
          >
            <GoogleIcon className="mr-2 h-4 w-4" />
            Google
          </Button>
          <Button
            variant="outline"
            onClick={() => console.log("Sign up with Outlook")}
          >
            <OutlookIcon className="mr-2 h-4 w-4" />
            Outlook
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="dark:bg-gray-900 bg-background px-2 text-muted-foreground">
              Or sign up with email
            </span>
          </div>
        </div>

        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className="pl-10"
              />
            </div>
            {state.errors?.email && (
              <p className="text-sm text-red-500 mt-1">
                {state.errors.email[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <PhoneNumberInput
              id="phone"
              name="phone"
              value={phone}
              onChange={setPhone}
              placeholder="+1 (555) 123-4567"
            />
            {state.errors?.phone && (
              <p className="text-sm text-red-500 mt-1">
                {state.errors.phone[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="8+ characters"
                className="pl-10"
              />
            </div>
            {state.errors?.password && (
              <p className="text-sm text-red-500 mt-1">
                {state.errors.password[0]}
              </p>
            )}
          </div>

          <div>
            <SubmitButton />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            passHref
            className="font-medium text-primary hover:underline"
          >
            Sign In
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
