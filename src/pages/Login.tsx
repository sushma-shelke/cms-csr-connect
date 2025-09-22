import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Building2, Lock, Mail, Smartphone, KeyRound } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CMSLogo from '@/assets/cms-logo-1.png';

export default function Login() {
  const [loginMethod, setLoginMethod] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
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
        toast({
          title: "Welcome to CMS Foundation MIS",
          description: "You have successfully logged in.",
        });
      }
    } else {
      if (!mobile || !otp) {
        setError('Please enter mobile number and OTP');
        return;
      }
      toast({
        title: "OTP Login (UI Only)",
        description: `Logged in with mobile: ${mobile}`,
      });
    }
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
    <div className="min-h-screen flex items-center justify-center " style={{background:'#ffffff !important'}}>
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
  <div>
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
                  onChange={() => setLoginMethod('otp')}
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
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="mobile"
                        type="tel"
                        placeholder="Enter mobile number"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="otp">OTP</Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="otp"
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="pl-10"
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

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
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
