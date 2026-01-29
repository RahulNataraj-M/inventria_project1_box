
'use client';

import { useState, useRef } from 'react';
import { useAuth, useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { uploadProfilePicture } from '@/firebase/storage';
import { updateProfile } from 'firebase/auth';
import { User as UserIcon, Loader2, Upload, Camera } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user || !auth?.currentUser) {
      return;
    }

    setImagePreview(URL.createObjectURL(file)); // Show preview immediately
    setIsUploading(true);

    try {
      const imageUrl = await uploadProfilePicture(user.uid, file);
      await updateProfile(auth.currentUser, { photoURL: imageUrl });

      toast({
        title: 'Profile Updated',
        description: 'Your new profile picture has been saved.',
      });
      // Force a refresh to show the new avatar in the header
      router.refresh();
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast({
        title: 'Upload Failed',
        description: 'Could not update your profile picture. Please try again.',
        variant: 'destructive',
      });
      setImagePreview(null); // Clear preview on error
    } finally {
      setIsUploading(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  if (isUserLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="font-headline text-3xl font-bold mb-6">Profile Settings</h1>
        <Card>
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-muted animate-pulse" />
              </div>
              <div className="space-y-2 flex-1">
                <div className="h-5 w-1/3 rounded-md bg-muted animate-pulse" />
                <div className="h-5 w-1/2 rounded-md bg-muted animate-pulse" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p>Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="font-headline text-3xl font-bold mb-6">Profile Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Your Information</CardTitle>
          <CardDescription>Update your profile picture and view your account details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-6 space-y-4 sm:space-y-0">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={imagePreview || user.photoURL || undefined} alt={user.displayName || 'User'} />
                <AvatarFallback>
                  <UserIcon className="w-12 h-12" />
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                className="absolute -bottom-1 -right-1 rounded-full h-8 w-8"
                onClick={handleAvatarClick}
                disabled={isUploading}
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
                <span className="sr-only">Change profile picture</span>
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/gif"
                className="hidden"
              />
            </div>
            <div className="space-y-2 text-center sm:text-left">
              <h2 className="text-2xl font-semibold">{user.displayName}</h2>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="space-y-4">
             <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input id="displayName" value={user.displayName || ''} disabled />
            </div>
             <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={user.email || ''} disabled />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
