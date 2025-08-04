import { useState, useRef } from 'react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Download, Upload, Type, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const QRGenerator = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [inputText, setInputText] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const generateQRCode = async (data: string) => {
    if (!data.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text or upload a file",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(data, {
        width: 300,
        margin: 2,
        color: {
          dark: '#1e40af', // Primary blue
          light: '#ffffff'
        }
      });
      setQrCodeUrl(qrCodeDataUrl);
      toast({
        title: "Success",
        description: "QR code generated successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate QR code",
        variant: "destructive"
      });
    }
    setIsGenerating(false);
  };

  const handleTextGenerate = () => {
    generateQRCode(inputText);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        generateQRCode(content);
      };
      
      if (file.type.startsWith('text/')) {
        reader.readAsText(file);
      } else {
        reader.readAsDataURL(file);
      }
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;
    
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = qrCodeUrl;
    link.click();
    
    toast({
      title: "Downloaded",
      description: "QR code saved to your device"
    });
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            QR Code Generator
          </h1>
          <p className="text-lg text-muted-foreground">
            Generate QR codes from text, documents, or any media
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="glass-effect shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="w-5 h-5" />
                Create QR Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="text" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="text" className="flex items-center gap-2">
                    <Type className="w-4 h-4" />
                    Text
                  </TabsTrigger>
                  <TabsTrigger value="file" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    File
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="text" className="space-y-4">
                  <div>
                    <Label htmlFor="text-input">Enter your text</Label>
                    <Textarea
                      id="text-input"
                      placeholder="Type your message here..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="min-h-[120px] mt-2"
                    />
                  </div>
                  <Button 
                    onClick={handleTextGenerate}
                    disabled={isGenerating || !inputText.trim()}
                    className="w-full gradient-primary text-white shadow-glow transition-smooth hover:shadow-elegant"
                  >
                    {isGenerating ? 'Generating...' : 'Generate QR Code'}
                  </Button>
                </TabsContent>
                
                <TabsContent value="file" className="space-y-4">
                  <div>
                    <Label htmlFor="file-input">Upload a file</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center mt-2 transition-smooth hover:border-primary/50">
                      <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-4">
                        Click to upload or drag and drop
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileUpload}
                        className="hidden"
                        accept="*/*"
                      />
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isGenerating}
                      >
                        Choose File
                      </Button>
                    </div>
                    {uploadedFile && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Selected: {uploadedFile.name}
                      </p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* QR Code Display */}
          <Card className="glass-effect shadow-elegant">
            <CardHeader>
              <CardTitle>Your QR Code</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              {qrCodeUrl ? (
                <div className="space-y-6">
                  <div className="p-4 bg-white rounded-lg shadow-inner">
                    <img 
                      src={qrCodeUrl} 
                      alt="Generated QR Code"
                      className="w-full max-w-[300px] h-auto"
                    />
                  </div>
                  <Button 
                    onClick={downloadQRCode}
                    className="w-full gradient-secondary text-white shadow-glow transition-smooth hover:shadow-elegant"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download QR Code
                  </Button>
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-lg bg-gradient-primary opacity-20 flex items-center justify-center">
                    <Type className="w-12 h-12 text-white" />
                  </div>
                  <p className="text-muted-foreground">
                    Your QR code will appear here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;