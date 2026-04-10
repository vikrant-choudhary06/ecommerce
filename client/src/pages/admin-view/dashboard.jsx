import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { addFeatureImage, getFeatureImages, deleteFeatureImage } from "@/store/common-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, ImagePlus, LayoutPanelTop } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const { toast } = useToast();

  function handleUploadFeatureImage() {
    if (uploadedImageUrls.length === 0) return;

    dispatch(addFeatureImage(uploadedImageUrls[0])).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrls([]);
        toast({
          title: "Banner published successfully",
        });
      } else {
        toast({
          title: data?.payload?.message || "Failed to publish banner",
          variant: "destructive",
        });
      }
    });
  }

  function handleDeleteBanner(id) {
    dispatch(deleteFeatureImage(id)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        toast({
          title: "Banner deleted successfully",
          variant: "destructive",
        });
      }
    });
  }

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <Card className="border-none shadow-xl bg-muted/20">
        <CardHeader className="flex flex-row items-center gap-4 border-b border-border/50 pb-6">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary">
            <ImagePlus size={24} />
          </div>
          <div>
            <CardTitle className="text-2xl font-serif font-bold">Banner Management</CardTitle>
            <p className="text-muted-foreground text-xs uppercase tracking-widest font-bold mt-1">Upload high-resolution carousel images</p>
          </div>
        </CardHeader>
        <CardContent className="pt-8">
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrls={uploadedImageUrls}
            setUploadedImageUrls={setUploadedImageUrls}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isCustomStyling={true}
          />
          <Button 
            onClick={handleUploadFeatureImage} 
            disabled={uploadedImageUrls.length === 0 || imageLoadingState}
            className="mt-8 w-full h-12 text-xs uppercase tracking-[0.2em] font-bold"
          >
            {imageLoadingState ? "Uploading..." : "Publish Banner"}
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <LayoutPanelTop className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-serif font-bold">Active Carousels</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureImageList && featureImageList.length > 0 ? (
            featureImageList.map((featureImgItem) => (
              <Card key={featureImgItem._id} className="group overflow-hidden border-none shadow-lg relative h-[250px] rounded-2xl">
                <img
                  src={featureImgItem.image}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button
                    onClick={() => handleDeleteBanner(featureImgItem._id)}
                    variant="destructive"
                    size="icon"
                    className="rounded-full w-12 h-12 shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-300"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
                <div className="absolute bottom-4 left-4">
                   <span className="bg-white/10 backdrop-blur-md text-white text-[9px] uppercase tracking-widest px-3 py-1 rounded-full border border-white/20">Active Slot</span>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-20 border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center opacity-40">
                <LayoutPanelTop className="w-12 h-12 mb-4" />
                <p className="text-sm font-bold uppercase tracking-widest">No banners active in carousel</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
