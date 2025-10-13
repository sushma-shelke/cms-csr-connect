// // import { useState } from 'react';
// // import { useAuth } from '@/contexts/AuthContext';
// // import { Button } from '@/components/ui/button';
// // import { Input } from '@/components/ui/input';
// // import { Label } from '@/components/ui/label';
// // import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// // import { Alert, AlertDescription } from '@/components/ui/alert';
// // import { Badge } from '@/components/ui/badge';
// // import { Loader2, Building2, Lock, Mail, Smartphone, KeyRound } from 'lucide-react';
// // import { useToast } from '@/hooks/use-toast';
// // import CMSLogo from '@/assets/cms-logo-1.png';

// // export default function Login() {
// //   const [loginMethod, setLoginMethod] = useState<'email' | 'otp'>('email');
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [mobile, setMobile] = useState('');
// //   const [otp, setOtp] = useState('');
// //   const [error, setError] = useState('');
// //   const [isSendingOtp, setIsSendingOtp] = useState(false);
// //   const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
// //   const [otpSent, setOtpSent] = useState(false);
// //   const { login, isLoading } = useAuth();
// //   const { toast } = useToast();

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setError('');

// //     if (loginMethod === 'email') {
// //       if (!email || !password) {
// //         setError('Please fill in all fields');
// //         return;
// //       }

// //       const success = await login(email, password);
// //       if (!success) {
// //         setError('Invalid email or password');
// //         toast({
// //           title: "Login Failed",
// //           description: "Please check your credentials and try again.",
// //           variant: "destructive",
// //         });
// //       } else {
// //         toast({
// //           title: "Welcome to CMS Foundation MIS",
// //           description: "You have successfully logged in.",
// //         });
// //       }
// //     } else {
// //       // OTP login flow
// //       if (!mobile || !otp) {
// //         setError('Please enter mobile number and OTP');
// //         return;
// //       }

// //       await handleVerifyOtp();
// //     }
// //   };

// //   const handleSendOtp = async () => {
// //     if (!mobile) {
// //       setError('Please enter mobile number');
// //       return;
// //     }

// //     // Basic mobile validation
// //     if (mobile.length < 10) {
// //       setError('Please enter a valid mobile number');
// //       return;
// //     }

// //     setIsSendingOtp(true);
// //     setError('');

// //     try {
// //       const response = await fetch('https://mumbailocal.org:8089/api/auth/send-otp', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({
// //           phoneNumber: mobile,
// //         }),
// //       });

// //       const data = await response.json();

// //       if (response.ok) {
// //         setOtpSent(true);
// //         toast({
// //           title: "OTP Sent",
// //           description: "OTP has been sent to your mobile number.",
// //         });
// //       } else {
// //         setError(data.message || 'Failed to send OTP');
// //         toast({
// //           title: "OTP Failed",
// //           description: data.message || "Failed to send OTP. Please try again.",
// //           variant: "destructive",
// //         });
// //       }
// //     } catch (error) {
// //       console.error('Error sending OTP:', error);
// //       setError('Failed to send OTP. Please try again.');
// //       toast({
// //         title: "Network Error",
// //         description: "Failed to connect to server. Please try again.",
// //         variant: "destructive",
// //       });
// //     } finally {
// //       setIsSendingOtp(false);
// //     }
// //   };

// //   const handleVerifyOtp = async () => {
// //     if (!mobile || !otp) {
// //       setError('Please enter mobile number and OTP');
// //       return;
// //     }

// //     setIsVerifyingOtp(true);
// //     setError('');

// //     try {
// //       // Get device info
// //       const deviceInfo = `${navigator.platform} ${navigator.userAgent}`;

// //       const response = await fetch('https://mumbailocal.org:8089/api/auth/verify-otp', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({
// //           phoneNumber: mobile,
// //           otpCode: otp,
// //           deviceInfo: deviceInfo,
// //         }),
// //       });

// //       const data = await response.json();

// //       if (response.ok) {
// //         toast({
// //           title: "Login Successful",
// //           description: "You have successfully logged in with OTP.",
// //         });
        
// //         // Here you would typically handle the successful login
// //         // For example, store the token and redirect
// //         console.log('Login successful:', data);
        
// //         // If you have a context or state management for auth, update it here
// //         // await loginWithOtp(data.token); // You might need to add this to your auth context
        
// //       } else {
// //         setError(data.message || 'Invalid OTP');
// //         toast({
// //           title: "OTP Verification Failed",
// //           description: data.message || "Invalid OTP. Please try again.",
// //           variant: "destructive",
// //         });
// //       }
// //     } catch (error) {
// //       console.error('Error verifying OTP:', error);
// //       setError('Failed to verify OTP. Please try again.');
// //       toast({
// //         title: "Network Error",
// //         description: "Failed to connect to server. Please try again.",
// //         variant: "destructive",
// //       });
// //     } finally {
// //       setIsVerifyingOtp(false);
// //     }
// //   };

// //   const resetOtpFlow = () => {
// //     setOtpSent(false);
// //     setOtp('');
// //     setMobile('');
// //     setError('');
// //   };

// //   const demoAccounts = [
// //     { role: 'Admin', email: 'admin@cmsfoundation.org', password: 'admin123' },
// //     { role: 'Project Officer', email: 'officer@cmsfoundation.org', password: 'officer123' },
// //     { role: 'CSR Head', email: 'head@cmsfoundation.org', password: 'head123' },
// //     { role: 'NGO Partner', email: 'ngo@healthfoundation.org', password: 'ngo123' },
// //   ];

// //   const fillDemoCredentials = (email: string, password: string) => {
// //     setEmail(email);
// //     setPassword(password);
// //     setLoginMethod('email'); // auto-switch to email login
// //   };

// //   return (
// //     <div className="min-h-screen flex items-center justify-center " style={{background:'#ffffff !important'}}>
// //       <div className="w-full max-w-md space-y-6">
// //        {/* Logo and Title */}
// // <div className="text-center space-y-4">
// //   <div className="flex justify-center">
// //     <img
// //       src={CMSLogo}
// //       alt="CMS Foundation Logo"
// //       className="w-28 h-auto mx-auto"
// //     />
// //   </div>
// //   <div>
// //  </div>
// // </div>

// //         {/* Login Card */}
// //         <Card className="shadow-xl border-border/50">
// //           <CardHeader className="space-y-1">
// //             <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
// //             <CardDescription className="text-center">
// //               Sign in to access your CSR management dashboard
// //             </CardDescription>
// //           </CardHeader>

// //           <CardContent className="space-y-6">
// //             {/* Radio Switch */}
// //             <div className="flex justify-center space-x-6">
// //               <label className="flex items-center space-x-2 cursor-pointer">
// //                 <input
// //                   type="radio"
// //                   value="email"
// //                   checked={loginMethod === 'email'}
// //                   onChange={() => setLoginMethod('email')}
// //                 />
// //                 <span>Email & Password</span>
// //               </label>
// //               <label className="flex items-center space-x-2 cursor-pointer">
// //                 <input
// //                   type="radio"
// //                   value="otp"
// //                   checked={loginMethod === 'otp'}
// //                   onChange={() => {
// //                     setLoginMethod('otp');
// //                     resetOtpFlow();
// //                   }}
// //                 />
// //                 <span>Mobile & OTP</span>
// //               </label>
// //             </div>

// //             {/* Single Form (switches fields based on method) */}
// //             <form onSubmit={handleSubmit} className="space-y-4">
// //               {loginMethod === 'email' ? (
// //                 <>
// //                   <div className="space-y-2">
// //                     <Label htmlFor="email">Email</Label>
// //                     <div className="relative">
// //                       <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
// //                       <Input
// //                         id="email"
// //                         type="email"
// //                         placeholder="Enter your email"
// //                         value={email}
// //                         onChange={(e) => setEmail(e.target.value)}
// //                         className="pl-10"
// //                         disabled={isLoading}
// //                       />
// //                     </div>
// //                   </div>
// //                   <div className="space-y-2">
// //                     <Label htmlFor="password">Password</Label>
// //                     <div className="relative">
// //                       <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
// //                       <Input
// //                         id="password"
// //                         type="password"
// //                         placeholder="Enter your password"
// //                         value={password}
// //                         onChange={(e) => setPassword(e.target.value)}
// //                         className="pl-10"
// //                         disabled={isLoading}
// //                       />
// //                     </div>
// //                   </div>
// //                 </>
// //               ) : (
// //                 <>
// //                   <div className="space-y-2">
// //                     <Label htmlFor="mobile">Mobile Number</Label>
// //                     <div className="flex space-x-2">
// //                       <div className="relative flex-1">
// //                         <Smartphone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
// //                         <Input
// //                           id="mobile"
// //                           type="tel"
// //                           placeholder="Enter mobile number"
// //                           value={mobile}
// //                           onChange={(e) => setMobile(e.target.value)}
// //                           className="pl-10"
// //                           disabled={otpSent || isSendingOtp}
// //                         />
// //                       </div>
// //                       <Button
// //                         type="button"
// //                         onClick={handleSendOtp}
// //                         disabled={!mobile || mobile.length < 10 || isSendingOtp || otpSent}
// //                         variant="outline"
// //                         className="whitespace-nowrap"
// //                       >
// //                         {isSendingOtp ? (
// //                           <Loader2 className="h-4 w-4 animate-spin" />
// //                         ) : otpSent ? (
// //                           'OTP Sent'
// //                         ) : (
// //                           'Send OTP'
// //                         )}
// //                       </Button>
// //                     </div>
// //                     {otpSent && (
// //                       <p className="text-xs text-green-600">
// //                         OTP sent successfully. Please check your mobile.
// //                       </p>
// //                     )}
// //                   </div>
// //                   <div className="space-y-2">
// //                     <Label htmlFor="otp">OTP</Label>
// //                     <div className="relative">
// //                       <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
// //                       <Input
// //                         id="otp"
// //                         type="text"
// //                         placeholder="Enter OTP"
// //                         value={otp}
// //                         onChange={(e) => setOtp(e.target.value)}
// //                         className="pl-10"
// //                         disabled={!otpSent || isVerifyingOtp}
// //                         maxLength={6}
// //                       />
// //                     </div>
// //                   </div>
// //                 </>
// //               )}

// //               {error && (
// //                 <Alert variant="destructive">
// //                   <AlertDescription>{error}</AlertDescription>
// //                 </Alert>
// //               )}

// //               <Button 
// //                 type="submit" 
// //                 className="w-full" 
// //                 disabled={
// //                   isLoading || 
// //                   (loginMethod === 'otp' && (isVerifyingOtp || !otpSent))
// //                 }
// //               >
// //                 {isLoading || isVerifyingOtp ? (
// //                   <>
// //                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
// //                     {loginMethod === 'email' ? 'Signing in...' : 'Verifying OTP...'}
// //                   </>
// //                 ) : loginMethod === 'email' ? (
// //                   'Sign In'
// //                 ) : (
// //                   'Login with OTP'
// //                 )}
// //               </Button>
// //             </form>
// //           </CardContent>

// //           <CardFooter>
// //             <div className="w-full space-y-3">
// //               <div className="text-center">
// //                 <p className="text-sm text-muted-foreground">Demo Accounts</p>
// //               </div>
// //               <div className="grid grid-cols-2 gap-2">
// //                 {demoAccounts.map((account, index) => (
// //                   <Button
// //                     key={index}
// //                     variant="outline"
// //                     size="sm"
// //                     onClick={() => fillDemoCredentials(account.email, account.password)}
// //                     className="flex flex-col items-start p-2 h-auto"
// //                     disabled={isLoading}
// //                   >
// //                     <Badge variant="secondary" className="mb-1 text-xs">
// //                       {account.role}
// //                     </Badge>
// //                     <span className="text-xs truncate w-full text-left">
// //                       {account.email}
// //                     </span>
// //                   </Button>
// //                 ))}
// //               </div>
// //             </div>
// //           </CardFooter>
// //         </Card>

// //         <div className="text-center text-sm text-muted-foreground">
// //           <p>&copy; 2025 CMS Foundation. All rights reserved.</p>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }


// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Badge } from '@/components/ui/badge';
// import { Loader2, Building2, Lock, Mail, Smartphone, KeyRound } from 'lucide-react';
// import { useToast } from '@/hooks/use-toast';
// import CMSLogo from '@/assets/cms-logo-1.png';

// export default function Login() {
//   const navigate = useNavigate();
//   const [loginMethod, setLoginMethod] = useState<'email' | 'otp'>('email');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [mobile, setMobile] = useState('');
//   const [otp, setOtp] = useState('');
//   const [error, setError] = useState('');
//   const [isSendingOtp, setIsSendingOtp] = useState(false);
//   const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
//   const [otpSent, setOtpSent] = useState(false);
//   const { login, isLoading } = useAuth();
//   const { toast } = useToast();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');

//     if (loginMethod === 'email') {
//       if (!email || !password) {
//         setError('Please fill in all fields');
//         return;
//       }

//       const success = await login(email, password);
//       if (!success) {
//         setError('Invalid email or password');
//         toast({
//           title: "Login Failed",
//           description: "Please check your credentials and try again.",
//           variant: "destructive",
//         });
//       } else {
//                 navigate('/');

//         toast({
//           title: "Welcome to CMS Foundation MIS",
//           description: "You have successfully logged in.",
//         });
//       }
//     } else {
//       // OTP login flow
//       if (!mobile || !otp) {
//         setError('Please enter mobile number and OTP');
//         return;
//       }

//       await handleVerifyOtp();
//     }
//   };

//   const formatPhoneNumber = (phone: string): string => {
//     // Remove any non-digit characters
//     const cleaned = phone.replace(/\D/g, '');
    
//     // If the number already starts with +91, return as is
//     if (cleaned.startsWith('91') && cleaned.length === 12) {
//       return `+${cleaned}`;
//     }
    
//     // If it's a 10-digit number, add +91
//     if (cleaned.length === 10) {
//       return `+91${cleaned}`;
//     }
    
//     // If it's 11 digits and starts with 0, remove 0 and add +91
//     if (cleaned.length === 11 && cleaned.startsWith('0')) {
//       return `+91${cleaned.substring(1)}`;
//     }
    
//     // Return the original if it doesn't match expected formats
//     return phone;
//   };

//   const handleSendOtp = async () => {
//     if (!mobile) {
//       setError('Please enter mobile number');
//       return;
//     }

//     // Basic mobile validation
//     const cleanedMobile = mobile.replace(/\D/g, '');
//     if (cleanedMobile.length < 10) {
//       setError('Please enter a valid 10-digit mobile number');
//       return;
//     }

//     setIsSendingOtp(true);
//     setError('');

//     try {
//       const formattedPhoneNumber = formatPhoneNumber(mobile);
      
//       const response = await fetch('https://mumbailocal.org:8089/api/auth/send-otp', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           phoneNumber: formattedPhoneNumber,
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setOtpSent(true);
//         toast({
//           title: "OTP Sent",
//           description: `OTP has been sent to ${formattedPhoneNumber}.`,
//         });
//       } else {
//         setError(data.message || 'Failed to send OTP');
//         toast({
//           title: "OTP Failed",
//           description: data.message || "Failed to send OTP. Please try again.",
//           variant: "destructive",
//         });
//       }
//     } catch (error) {
//       console.error('Error sending OTP:', error);
//       setError('Failed to send OTP. Please try again.');
//       toast({
//         title: "Network Error",
//         description: "Failed to connect to server. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsSendingOtp(false);
//     }
//   };

// //   const handleVerifyOtp = async () => {
// //     if (!mobile || !otp) {
// //       setError('Please enter mobile number and OTP');
// //       return;
// //     }

// //     setIsVerifyingOtp(true);
// //     setError('');

// //     try {
// //       // Get device info
// //       const deviceInfo = `${navigator.platform} ${navigator.userAgent}`;
// //       const formattedPhoneNumber = formatPhoneNumber(mobile);

// //       const response = await fetch('https://mumbailocal.org:8089/api/auth/verify-otp', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({
// //           phoneNumber: formattedPhoneNumber,
// //           otpCode: otp,
// //           deviceInfo: deviceInfo,
// //         }),
// //       });

// //       const data = await response.json();

// //       if (response.ok) {
// //         toast({
// //           title: "Login Successful",
// //           description: "You have successfully logged in with OTP.",
// //         });
        
// //         // Here you would typically handle the successful login
// //         // For example, store the token and redirect
// //         console.log('Login successful:', data);
        
// //         // If you have a context or state management for auth, update it here
// //         // await loginWithOtp(data.token); // You might need to add this to your auth context
        
// //         // Navigate to dashboard after successful OTP login
// // navigate('/');

        
// //       } else {
// //         setError(data.message || 'Invalid OTP');
// //         toast({
// //           title: "OTP Verification Failed",
// //           description: data.message || "Invalid OTP. Please try again.",
// //           variant: "destructive",
// //         });
// //       }
// //     } catch (error) {
// //       console.error('Error verifying OTP:', error);
// //       setError('Failed to verify OTP. Please try again.');
// //       toast({
// //         title: "Network Error",
// //         description: "Failed to connect to server. Please try again.",
// //         variant: "destructive",
// //       });
// //     } finally {
// //       setIsVerifyingOtp(false);
// //     }
// //   };

// const handleVerifyOtp = async () => {
//   if (!mobile || !otp) {
//     setError('Please enter mobile number and OTP');
//     return;
//   }

//   setIsVerifyingOtp(true);
//   setError('');

//   try {
//     const deviceInfo = `${navigator.platform} ${navigator.userAgent}`;
//     const formattedPhoneNumber = formatPhoneNumber(mobile);

//     // STEP 1: Verify OTP
//     const verifyResponse = await fetch('https://mumbailocal.org:8089/api/auth/verify-otp', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         phoneNumber: formattedPhoneNumber,
//         otpCode: otp,
//         deviceInfo: deviceInfo,
//       }),
//     });

//     const verifyData = await verifyResponse.json();

//     if (!verifyResponse.ok || !verifyData?.jwtToken) {
//       setError(verifyData.message || 'Invalid OTP');
//       toast({
//         title: "OTP Verification Failed",
//         description: verifyData.message || "Invalid OTP. Please try again.",
//         variant: "destructive",
//       });
//       return;
//     }

//     // ✅ Save JWT Token in Local Storage
//     localStorage.setItem('jwtToken', verifyData.jwtToken);

//     // STEP 2: Validate Token
//     const validateResponse = await fetch('https://mumbailocal.org:8089/api/auth/validate-token', {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${verifyData.jwtToken}`,
//         'Content-Type': 'application/json'
//       }
//     });

//     const validateData = await validateResponse.json();

//     if (validateResponse.ok) {
//       toast({
//         title: "Login Successful",
//         description: "You have successfully logged in.",
//       });

//       // ✅ Redirect to home page
//       navigate('/');
//     } else {
//       setError(validateData.message || 'Token validation failed');
//       toast({
//         title: "Session Error",
//         description: "Token validation failed. Please login again.",
//         variant: "destructive",
//       });
//     }
//   } catch (error) {
//     console.error('Error verifying OTP:', error);
//     setError('Failed to verify OTP. Please try again.');
//     toast({
//       title: "Network Error",
//       description: "Failed to connect to server. Please try again.",
//       variant: "destructive",
//     });
//   } finally {
//     setIsVerifyingOtp(false);
//   }
// };


//   const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
    
//     // Allow only numbers and limit to 10 digits
//     const cleaned = value.replace(/\D/g, '').slice(0, 10);
//     setMobile(cleaned);
//   };

//   const resetOtpFlow = () => {
//     setOtpSent(false);
//     setOtp('');
//     setMobile('');
//     setError('');
//   };

//   const demoAccounts = [
//     { role: 'Admin', email: 'admin@cmsfoundation.org', password: 'admin123' },
//     { role: 'Project Officer', email: 'officer@cmsfoundation.org', password: 'officer123' },
//     { role: 'CSR Head', email: 'head@cmsfoundation.org', password: 'head123' },
//     { role: 'NGO Partner', email: 'ngo@healthfoundation.org', password: 'ngo123' },
//   ];

//   const fillDemoCredentials = (email: string, password: string) => {
//     setEmail(email);
//     setPassword(password);
//     setLoginMethod('email'); // auto-switch to email login
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center " style={{background:'#ffffff !important'}}>
//       <div className="w-full max-w-md space-y-6">
//        {/* Logo and Title */}
// <div className="text-center space-y-4">
//   <div className="flex justify-center">
//     <img
//       src={CMSLogo}
//       alt="CMS Foundation Logo"
//       className="w-28 h-auto mx-auto"
//     />
//   </div>
//   <div>
//  </div>
// </div>

//         {/* Login Card */}
//         <Card className="shadow-xl border-border/50">
//           <CardHeader className="space-y-1">
//             <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
//             <CardDescription className="text-center">
//               Sign in to access your CSR management dashboard
//             </CardDescription>
//           </CardHeader>

//           <CardContent className="space-y-6">
//             {/* Radio Switch */}
//             <div className="flex justify-center space-x-6">
//               <label className="flex items-center space-x-2 cursor-pointer">
//                 <input
//                   type="radio"
//                   value="email"
//                   checked={loginMethod === 'email'}
//                   onChange={() => setLoginMethod('email')}
//                 />
//                 <span>Email & Password</span>
//               </label>
//               <label className="flex items-center space-x-2 cursor-pointer">
//                 <input
//                   type="radio"
//                   value="otp"
//                   checked={loginMethod === 'otp'}
//                   onChange={() => {
//                     setLoginMethod('otp');
//                     resetOtpFlow();
//                   }}
//                 />
//                 <span>Mobile & OTP</span>
//               </label>
//             </div>

//             {/* Single Form (switches fields based on method) */}
//             <form onSubmit={handleSubmit} className="space-y-4">
//               {loginMethod === 'email' ? (
//                 <>
//                   <div className="space-y-2">
//                     <Label htmlFor="email">Email</Label>
//                     <div className="relative">
//                       <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                       <Input
//                         id="email"
//                         type="email"
//                         placeholder="Enter your email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         className="pl-10"
//                         disabled={isLoading}
//                       />
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="password">Password</Label>
//                     <div className="relative">
//                       <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                       <Input
//                         id="password"
//                         type="password"
//                         placeholder="Enter your password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         className="pl-10"
//                         disabled={isLoading}
//                       />
//                     </div>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <div className="space-y-2">
//                     <Label htmlFor="mobile">Mobile Number</Label>
//                     <div className="flex space-x-2">
//                       <div className="relative flex-1">
//                         <div className="absolute left-3 top-3 flex items-center">
//                           <span className="text-sm text-muted-foreground mr-1">+91</span>
//                           <Smartphone className="h-4 w-4 text-muted-foreground" />
//                         </div>
//                         <Input
//                           id="mobile"
//                           type="tel"
//                           placeholder="Enter 10-digit mobile number"
//                           value={mobile}
//                           onChange={handleMobileChange}
//                           className="pl-16"
//                           disabled={otpSent || isSendingOtp}
//                           maxLength={10}
//                         />
//                       </div>
//                       <Button
//                         type="button"
//                         onClick={handleSendOtp}
//                         disabled={!mobile || mobile.length < 10 || isSendingOtp || otpSent}
//                         variant="outline"
//                         className="whitespace-nowrap"
//                       >
//                         {isSendingOtp ? (
//                           <Loader2 className="h-4 w-4 animate-spin" />
//                         ) : otpSent ? (
//                           'OTP Sent'
//                         ) : (
//                           'Send OTP'
//                         )}
//                       </Button>
//                     </div>
//                     {otpSent && (
//                       <p className="text-xs text-green-600">
//                         OTP sent to +91{mobile}. Please check your mobile.
//                       </p>
//                     )}
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="otp">OTP</Label>
//                     <div className="relative">
//                       <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                       <Input
//                         id="otp"
//                         type="text"
//                         placeholder="Enter 6-digit OTP"
//                         value={otp}
//                         onChange={(e) => setOtp(e.target.value)}
//                         className="pl-10"
//                         disabled={!otpSent || isVerifyingOtp}
//                         maxLength={6}
//                       />
//                     </div>
//                   </div>
//                 </>
//               )}

//               {error && (
//                 <Alert variant="destructive">
//                   <AlertDescription>{error}</AlertDescription>
//                 </Alert>
//               )}

//               <Button 
//                 type="submit" 
//                 className="w-full" 
//                 disabled={
//                   isLoading || 
//                   (loginMethod === 'otp' && (isVerifyingOtp || !otpSent))
//                 }
//               >
//                 {isLoading || isVerifyingOtp ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     {loginMethod === 'email' ? 'Signing in...' : 'Verifying OTP...'}
//                   </>
//                 ) : loginMethod === 'email' ? (
//                   'Sign In'
//                 ) : (
//                   'Login with OTP'
//                 )}
//               </Button>
//             </form>
//           </CardContent>

//           <CardFooter>
//             <div className="w-full space-y-3">
//               <div className="text-center">
//                 <p className="text-sm text-muted-foreground">Demo Accounts</p>
//               </div>
//               <div className="grid grid-cols-2 gap-2">
//                 {demoAccounts.map((account, index) => (
//                   <Button
//                     key={index}
//                     variant="outline"
//                     size="sm"
//                     onClick={() => fillDemoCredentials(account.email, account.password)}
//                     className="flex flex-col items-start p-2 h-auto"
//                     disabled={isLoading}
//                   >
//                     <Badge variant="secondary" className="mb-1 text-xs">
//                       {account.role}
//                     </Badge>
//                     <span className="text-xs truncate w-full text-left">
//                       {account.email}
//                     </span>
//                   </Button>
//                 ))}
//               </div>
//             </div>
//           </CardFooter>
//         </Card>

//         <div className="text-center text-sm text-muted-foreground">
//           <p>&copy; 2025 CMS Foundation. All rights reserved.</p>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Lock, Mail, Smartphone, KeyRound } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CMSLogo from '@/assets/cms-logo-1.png';

export default function Login() {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const { login, loginWithOtp, isLoading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (loginMethod === 'email') {
      if (!email || !password) {
        setError('Please fill in all fields');
        return;
      }

      const success = await login(email, password);
      if (!success) {
        setError('Invalid email or password');
        toast({
          title: "Login Failed",
          description: "Please check your credentials and try again.",
          variant: "destructive",
        });
      } else {
        navigate('/');
        toast({
          title: "Welcome to CMS Foundation MIS",
          description: "You have successfully logged in.",
        });
      }
    } else {
      // OTP login flow
      if (!mobile || !otp) {
        setError('Please enter mobile number and OTP');
        return;
      }

      await handleVerifyOtp();
    }
  };

  const formatPhoneNumber = (phone: string): string => {
    // Remove any non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // If the number already starts with +91, return as is
    if (cleaned.startsWith('91') && cleaned.length === 12) {
      return `+${cleaned}`;
    }
    
    // If it's a 10-digit number, add +91
    if (cleaned.length === 10) {
      return `+91${cleaned}`;
    }
    
    // If it's 11 digits and starts with 0, remove 0 and add +91
    if (cleaned.length === 11 && cleaned.startsWith('0')) {
      return `+91${cleaned.substring(1)}`;
    }
    
    // Return the original if it doesn't match expected formats
    return phone;
  };

  const handleSendOtp = async () => {
    if (!mobile) {
      setError('Please enter mobile number');
      return;
    }

    // Basic mobile validation
    const cleanedMobile = mobile.replace(/\D/g, '');
    if (cleanedMobile.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsSendingOtp(true);
    setError('');

    try {
      const formattedPhoneNumber = formatPhoneNumber(mobile);
      
      const response = await fetch('https://mumbailocal.org:8089/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: formattedPhoneNumber,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setOtpSent(true);
        toast({
          title: "OTP Sent",
          description: `OTP has been sent to ${formattedPhoneNumber}.`,
        });
      } else {
        setError(data.message || 'Failed to send OTP');
        toast({
          title: "OTP Failed",
          description: data.message || "Failed to send OTP. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setError('Failed to send OTP. Please try again.');
      toast({
        title: "Network Error",
        description: "Failed to connect to server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!mobile || !otp) {
      setError('Please enter mobile number and OTP');
      return;
    }

    setIsVerifyingOtp(true);
    setError('');

    try {
      const deviceInfo = `${navigator.platform} ${navigator.userAgent}`;
      const formattedPhoneNumber = formatPhoneNumber(mobile);

      console.log('🔐 Step 1: Verifying OTP for:', formattedPhoneNumber);

      // STEP 1: Verify OTP
      const verifyResponse = await fetch('https://mumbailocal.org:8089/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: formattedPhoneNumber,
          otpCode: otp,
          deviceInfo: deviceInfo,
        }),
      });

      const verifyData = await verifyResponse.json();
      console.log('✅ Step 1 Response:', verifyData);

      if (!verifyResponse.ok || !verifyData?.jwtToken) {
        console.error('❌ OTP Verification failed:', verifyData);
        setError(verifyData.message || 'Invalid OTP');
        toast({
          title: "OTP Verification Failed",
          description: verifyData.message || "Invalid OTP. Please try again.",
          variant: "destructive",
        });
        setIsVerifyingOtp(false);
        return;
      }

      // Save JWT Token in Local Storage
      localStorage.setItem('jwtToken', verifyData.jwtToken);
      console.log('💾 JWT Token saved to localStorage');

      console.log('🔐 Step 2: Validating Token');

      // STEP 2: Validate Token
      const validateResponse = await fetch('https://mumbailocal.org:8089/api/auth/validate-token', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${verifyData.jwtToken}`,
          'Content-Type': 'application/json'
        }
      });

      const validateData = await validateResponse.json();
      console.log('✅ Step 2 Response:', validateData);

      if (validateResponse.ok) {
        console.log('🔐 Step 3: Creating user session');
        
        // STEP 3: Login with OTP in auth context
        const success = await loginWithOtp(formattedPhoneNumber);
        console.log('✅ Step 3: Session created, success:', success);
        
        if (success) {
          console.log('🎉 Login successful! Navigating to dashboard...');
          
          toast({
            title: "Login Successful",
            description: "You have successfully logged in.",
          });
          
          // Force navigation
          setTimeout(() => {
            console.log('🚀 Navigating now...');
            navigate('/', { replace: true });
          }, 500);
        } else {
          console.error('❌ Failed to create session');
          setError('Failed to create session');
          toast({
            title: "Session Error",
            description: "Failed to create user session. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        console.error('❌ Token validation failed:', validateData);
        setError(validateData.message || 'Token validation failed');
        toast({
          title: "Session Error",
          description: "Token validation failed. Please login again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('❌ Error verifying OTP:', error);
      setError('Failed to verify OTP. Please try again.');
      toast({
        title: "Network Error",
        description: "Failed to connect to server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow only numbers and limit to 10 digits
    const cleaned = value.replace(/\D/g, '').slice(0, 10);
    setMobile(cleaned);
  };

  const resetOtpFlow = () => {
    setOtpSent(false);
    setOtp('');
    setMobile('');
    setError('');
  };

  const demoAccounts = [
    { role: 'Admin', email: 'admin@cmsfoundation.org', password: 'admin123' },
    { role: 'Project Officer', email: 'officer@cmsfoundation.org', password: 'officer123' },
    { role: 'CSR Head', email: 'head@cmsfoundation.org', password: 'head123' },
    { role: 'NGO Partner', email: 'ngo@healthfoundation.org', password: 'ngo123' },
  ];

  const fillDemoCredentials = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
    setLoginMethod('email'); // auto-switch to email login
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{background:'#ffffff !important'}}>
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <img
              src={CMSLogo}
              alt="CMS Foundation Logo"
              className="w-28 h-auto mx-auto"
            />
          </div>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl border-border/50">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Sign in to access your CSR management dashboard
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Radio Switch */}
            <div className="flex justify-center space-x-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value="email"
                  checked={loginMethod === 'email'}
                  onChange={() => setLoginMethod('email')}
                />
                <span>Email & Password</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value="otp"
                  checked={loginMethod === 'otp'}
                  onChange={() => {
                    setLoginMethod('otp');
                    resetOtpFlow();
                  }}
                />
                <span>Mobile & OTP</span>
              </label>
            </div>

            {/* Single Form (switches fields based on method) */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {loginMethod === 'email' ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <div className="flex space-x-2">
                      <div className="relative flex-1">
                        <div className="absolute left-3 top-3 flex items-center">
                          <span className="text-sm text-muted-foreground mr-1">+91</span>
                          <Smartphone className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Input
                          id="mobile"
                          type="tel"
                          placeholder="Enter 10-digit mobile number"
                          value={mobile}
                          onChange={handleMobileChange}
                          className="pl-16"
                          disabled={otpSent || isSendingOtp}
                          maxLength={10}
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={!mobile || mobile.length < 10 || isSendingOtp || otpSent}
                        variant="outline"
                        className="whitespace-nowrap"
                      >
                        {isSendingOtp ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : otpSent ? (
                          'OTP Sent'
                        ) : (
                          'Send OTP'
                        )}
                      </Button>
                    </div>
                    {otpSent && (
                      <p className="text-xs text-green-600">
                        OTP sent to +91{mobile}. Please check your mobile.
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="otp">OTP</Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="otp"
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="pl-10"
                        disabled={!otpSent || isVerifyingOtp}
                        maxLength={6}
                      />
                    </div>
                  </div>
                </>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={
                  isLoading || 
                  (loginMethod === 'otp' && (isVerifyingOtp || !otpSent))
                }
              >
                {isLoading || isVerifyingOtp ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {loginMethod === 'email' ? 'Signing in...' : 'Verifying OTP...'}
                  </>
                ) : loginMethod === 'email' ? (
                  'Sign In'
                ) : (
                  'Login with OTP'
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter>
            <div className="w-full space-y-3">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Demo Accounts</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {demoAccounts.map((account, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => fillDemoCredentials(account.email, account.password)}
                    className="flex flex-col items-start p-2 h-auto"
                    disabled={isLoading}
                  >
                    <Badge variant="secondary" className="mb-1 text-xs">
                      {account.role}
                    </Badge>
                    <span className="text-xs truncate w-full text-left">
                      {account.email}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          </CardFooter>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>&copy; 2025 CMS Foundation. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}