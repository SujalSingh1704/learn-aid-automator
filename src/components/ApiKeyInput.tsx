
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { getGeminiApiKey, setGeminiApiKey } from "@/lib/quizGenerator";

const ApiKeyInput = () => {
  const [apiKey, setApiKey] = useState(getGeminiApiKey() || "");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSaveKey = () => {
    if (apiKey && apiKey.trim()) {
      setGeminiApiKey(apiKey.trim());
      localStorage.setItem("gemini-api-key", apiKey.trim());
      toast({
        title: "API Key Saved",
        description: "Your Gemini API key has been saved for this session.",
      });
      setIsOpen(false);
    } else {
      toast({
        title: "Invalid API Key",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
    }
  };

  // Load API key from localStorage when component mounts
  React.useEffect(() => {
    const savedKey = localStorage.getItem("gemini-api-key");
    if (savedKey) {
      setApiKey(savedKey);
      setGeminiApiKey(savedKey);
    }
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {getGeminiApiKey() ? "Update API Key" : "Set API Key"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Gemini API Key</DialogTitle>
          <DialogDescription>
            Enter your Gemini API key to generate AI-powered quizzes. You can get a key from{" "}
            <a
              href="https://ai.google.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Google AI Studio
            </a>
            .
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="gemini-key">API Key</Label>
          <Input
            id="gemini-key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Gemini API key"
            className="mt-1"
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSaveKey}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyInput;
