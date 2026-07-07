import os
import sys

def main():
    try:
        from PIL import Image
    except ImportError:
        print("Pillow is not installed. Installing Pillow...")
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
        from PIL import Image

    src_dir = r"c:\Users\jassi\Desktop\bus-tracking\modern-landing-page\ezgif-42d3c99f8f917e40-png-split"
    dest_dir = r"c:\Users\jassi\Desktop\bus-tracking\landing_page\public\images\bus"

    if not os.path.exists(src_dir):
        print(f"Error: Source directory does not exist: {src_dir}")
        sys.exit(1)

    os.makedirs(dest_dir, exist_ok=True)

    print("Starting optimization & conversion of 240 PNG frames to JPG...")
    
    # We will process frames from 1 to 240
    for i in range(1, 241):
        png_name = f"ezgif-frame-{i:03d}.png"
        png_path = os.path.join(src_dir, png_name)
        jpg_name = f"ezgif-frame-{i:03d}.jpg"
        jpg_path = os.path.join(dest_dir, jpg_name)
        
        if os.path.exists(png_path):
            try:
                with Image.open(png_path) as img:
                    # Convert to RGB (required for JPG)
                    rgb_img = img.convert("RGB")
                    
                    # If the image is extremely large, resize it to a maximum width of 1920px for web responsiveness
                    max_width = 1920
                    if rgb_img.width > max_width:
                        w_percent = (max_width / float(rgb_img.width))
                        h_size = int((float(rgb_img.height) * float(w_percent)))
                        rgb_img = rgb_img.resize((max_width, h_size), Image.Resampling.LANCZOS)
                    
                    # Save with optimized JPEG quality
                    rgb_img.save(jpg_path, "JPEG", quality=80, optimize=True)
                
                # Report every 20 frames to avoid cluttered logs
                if i % 20 == 0 or i == 1 or i == 240:
                    print(f"Optimized & Converted: {png_name} -> {jpg_name}")
            except Exception as e:
                print(f"Failed to convert {png_name}: {e}")
        else:
            print(f"Warning: File not found: {png_path}")
            
    print("Optimization and conversion complete!")

if __name__ == "__main__":
    main()
