import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function UnauthorizedPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>
            You don&apos;t have permission to access this page
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            This page requires special permissions. If you believe you should
            have access, please contact an administrator.
          </p>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button asChild variant="outline" className="flex-1">
            <Link href="/">Go Home</Link>
          </Button>
          <Button asChild className="flex-1">
            <Link href="/profile">View Profile</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
