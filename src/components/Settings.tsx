
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Settings as SettingsIcon, Key, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface SettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LOCAL_STORAGE_API_KEY = 'openai-api-key';

const Settings = ({ open, onOpenChange }: SettingsProps) => {
  const [apiKey, setApiKey] = useState('');
  const { toast } = useToast();

  // Load API key from localStorage when component mounts
  useEffect(() => {
    const savedApiKey = localStorage.getItem(LOCAL_STORAGE_API_KEY) || '';
    setApiKey(savedApiKey);
  }, [open]); // Reload when dialog opens

  const handleSaveSettings = () => {
    // Save API key to localStorage
    localStorage.setItem(LOCAL_STORAGE_API_KEY, apiKey);
    toast({
      title: 'Settings saved',
      description: 'Your OpenAI API key has been saved.',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Settings
          </DialogTitle>
          <DialogDescription>
            Configure your personal settings for the AI Shopping Assistant.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="api-key" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              OpenAI API Key
            </Label>
            <Input
              id="api-key"
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Enter your OpenAI API key to use the AI image analysis feature. Your key is stored
              locally in your browser and is never sent to our servers.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSaveSettings} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Settings;
