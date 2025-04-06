import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, FileVideo, Link as LinkIcon, Upload } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ContentUploaderProps {
  onContentAdded: (content: {
    type: string;
    source: string;
    title?: string;
  }) => void;
  isLoading?: boolean;
}

export default function ContentUploader({
  onContentAdded,
  isLoading = false,
}: ContentUploaderProps) {
  const [urlInput, setUrlInput] = useState("");
  const [urlError, setUrlError] = useState("");
  const [fileTitle, setFileTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUrlError("");

    if (!urlInput.trim()) {
      setUrlError("Please enter a valid URL");
      return;
    }

    // Basic URL validation
    try {
      new URL(urlInput);
    } catch (e) {
      setUrlError("Please enter a valid URL");
      return;
    }

    // Add console log to debug
    console.log("Adding URL content:", urlInput);

    onContentAdded({
      type: "url",
      source: urlInput,
    });
  };

  const handleFileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFileError("");

    if (!selectedFile) {
      setFileError("Please select a file");
      return;
    }

    if (!fileTitle.trim()) {
      setFileError("Please enter a title for your video");
      return;
    }

    // Add console log to debug
    console.log("Adding file content:", selectedFile, fileTitle);

    // In a real implementation, you would upload the file to a storage service
    // and then pass the URL to onContentAdded
    onContentAdded({
      type: "file",
      source: URL.createObjectURL(selectedFile),
      title: fileTitle,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden">
      <Tabs defaultValue="url" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-[#111]">
          <TabsTrigger value="url" className="data-[state=active]:bg-[#1a1a1a]">
            <LinkIcon className="mr-2 h-4 w-4" />
            URL
          </TabsTrigger>
          <TabsTrigger
            value="file"
            className="data-[state=active]:bg-[#1a1a1a]"
          >
            <FileVideo className="mr-2 h-4 w-4" />
            File Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="url" className="p-6">
          <form onSubmit={handleUrlSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="url"
                className="text-sm font-medium text-gray-300"
              >
                Video URL
              </Label>
              <Input
                id="url"
                type="text"
                placeholder="https://example.com/video.mp4"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="bg-[#222] border-gray-700 text-white"
              />
              <p className="text-xs text-gray-400">
                Paste a direct link to a video file or streaming URL
              </p>
            </div>

            {urlError && (
              <Alert
                variant="destructive"
                className="bg-red-900/20 border-red-800 text-red-300"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{urlError}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Add Content"}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="file" className="p-6">
          <form onSubmit={handleFileSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="text-sm font-medium text-gray-300"
              >
                Video Title
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="My Awesome Video"
                value={fileTitle}
                onChange={(e) => setFileTitle(e.target.value)}
                className="bg-[#222] border-gray-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="file"
                className="text-sm font-medium text-gray-300"
              >
                Video File
              </Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-[#222] border-gray-700 hover:border-red-500 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      MP4, WebM, or MKV (MAX. 2GB)
                    </p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              {selectedFile && (
                <p className="text-xs text-gray-400">
                  Selected: {selectedFile.name} (
                  {Math.round((selectedFile.size / 1024 / 1024) * 10) / 10} MB)
                </p>
              )}
            </div>

            {fileError && (
              <Alert
                variant="destructive"
                className="bg-red-900/20 border-red-800 text-red-300"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{fileError}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Uploading..." : "Upload Video"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
