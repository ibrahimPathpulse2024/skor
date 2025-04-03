"use client";

import { CircleMinus, Edit, Upload } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Header from "../../components/header";
import ProfileSkeleton from "../../components/profile/ProfileSkeleton";

type UserSession = {
  name?: string;
  email?: string;
  image?: string;
};

type ProfileData = {
  displayName: string;
  gamerId: string;
  profileImageD?: string;
  email: string;
};

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const userSession: UserSession = useMemo(
    () => session?.user ?? {},
    [session]
  );

  const [showRemoveOption, setShowRemoveOption] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState<ProfileData>({
    displayName: "Guest",
    gamerId: "#98976899",
    email: "email@email.com",
  });

  const [profileImage, setProfileImage] = useState(userSession?.image);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        // Load from localStorage
        const savedData = localStorage.getItem("profileData");
        const initialData = savedData
          ? JSON.parse(savedData)
          : {
              displayName: userSession?.name || "Guest",
              gamerId: "#98976899",
              email: userSession?.email || "email@email.com",
              profileImageD: userSession?.image,
            };

        setProfileData(initialData);
        setProfileImage(userSession?.image || initialData.profileImageD);

        // Simulate combined loading of session and local data
        await Promise.all([
          new Promise((resolve) => setTimeout(resolve, 300)),
          session
            ? Promise.resolve()
            : new Promise((resolve) => setTimeout(resolve, 500)),
        ]);
      } catch (err) {
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [userSession]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setSelectedFile(file);

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileImage(event.target.result.toString());
          setShowRemoveOption(true);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    } catch (err) {
      setError("Failed to upload image");
    }
  };

  const removeImage = () => {
    setProfileImage(userSession?.image || "/default-avatar.svg");
    setShowRemoveOption(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setUploading(true);
      let imageUrl = profileImage;

      // Upload new image if exists
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const uploadResponse = await fetch("/api/profile/image", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || "Image upload failed");
        }

        const { imageUrl: newUrl } = await uploadResponse.json();
        imageUrl = newUrl;
        setProfileImage(newUrl);
      }

      // Update profile data
      const updatedData = {
        ...profileData,
        profileImageD: imageUrl,
      };

      const updateResponse = await fetch("/api/profile/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: updatedData.displayName,
          gamerId: updatedData.gamerId,
          image: imageUrl,
        }),
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.error || "Profile update failed");
      }

      // Refresh session data
      await update();
      localStorage.setItem("profileData", JSON.stringify(updatedData));
      setSelectedFile(null);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setUploading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-[#1a1512] text-white flex flex-col items-center justify-center">
        <Header />
        <div className="text-center p-8">
          <h2 className="text-2xl text-red-500 mb-4">Error: {error}</h2>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#ee5d4b] rounded-lg hover:bg-[#d44c2a] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#1a1512] text-white flex flex-col">
      <Header />
      <main className="flex-1 flex justify-center items-start p-4 md:p-6 lg:p-8">
        <div className="w-full max-w-5xl border border-[#2a2520] p-8 md:p-16 lg:mt-10 md:mt-10">
          <div className="mb-7 animate-fadeIn">
            <h1 className="hidden sm:block text-3xl lg:text-5xl md:text-4xl mb-1 font-chakra leading-tight tracking-wider">
              Welcome, {profileData.displayName.split(" ")[0]}.
            </h1>
          </div>

          {/* Profile Picture Section */}
          <div className="mb-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-[#3a3530] relative">
                  <Image
                    src={profileImage || "/default-avatar.svg"}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover transition-opacity opacity-0 duration-300"
                    onLoadingComplete={(img) =>
                      img.classList.remove("opacity-0")
                    }
                    onError={() => setProfileImage("/default-avatar.svg")}
                  />
                </div>
              </div>

              {/* Upload Controls */}
              <div className="flex flex-col flex-1">
                <p className="mb-1 text-[0.7rem] font-sora font-bold text-zinc-400">
                  Profile Picture
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="flex items-center gap-2 px-3 py-2 bg-[#3a3530] cursor-pointer hover:bg-[#4a4540] transition-colors">
                    <Upload className="h-4 w-4" />
                    <span className="text-[0.7rem] font-sora font-bold text-zinc-400">
                      Replace File
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleImageUpload}
                      accept=".png,.jpg,.jpeg"
                    />
                  </label>
                  {showRemoveOption && (
                    <button
                      onClick={removeImage}
                      className="flex items-center gap-2 px-3 py-2 bg-[#3a3530] hover:bg-[#4a4540] transition-colors"
                    >
                      <CircleMinus className="h-4 w-4" />
                      <span className="text-[0.7rem] font-sora font-bold text-zinc-400">
                        Remove Picture
                      </span>
                    </button>
                  )}
                </div>
                <p className="text-xs mt-1 text-gray-400 whitespace-nowrap">
                  (.png, .jpg files up to 10 mb, at least 400px by 400px)
                </p>
              </div>

              <div className="flex-shrink-0 w-full sm:ml-auto sm:w-auto mt-4 sm:mt-0">
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center justify-center gap-1 text-xs sm:text-sm px-3 py-2 border border-[#d44c2a] rounded-lg text-[#d44c2a] hover:bg-[#d44c2a]/10 transition-all w-full sm:w-auto"
                  >
                    <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Edit</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 animate-fadeIn">
            {isEditing ? (
              <>
                <div>
                  <label
                    htmlFor="displayName"
                    className="block mb-2 text-sm font-sora text-zinc-400"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="displayName"
                    value={profileData.displayName}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-[#3a3530] border border-[#4a4540] focus:outline-none focus:ring-1 focus:ring-[#d44c2a] rounded-md"
                  />
                </div>
                <div>
                  <label
                    htmlFor="gamerId"
                    className="block mb-2 text-sm font-sora text-zinc-400"
                  >
                    Gamer ID
                  </label>
                  <input
                    type="text"
                    id="gamerId"
                    value={profileData.gamerId}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-[#3a3530] border border-[#4a4540] focus:outline-none focus:ring-1 focus:ring-[#d44c2a] rounded-md"
                  />
                </div>
                <div className="md:col-span-2">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-sora text-zinc-400"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-[#3a3530] border border-[#4a4540] focus:outline-none focus:ring-1 focus:ring-[#d44c2a] rounded-md"
                    disabled
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-[#ee5d4b] font-bold font-chakra mb-2 text-sm">
                    Name
                  </label>
                  <p className="text-white text-lg lg:text-xl font-medium font-chakra">
                    {profileData.displayName}
                  </p>
                </div>
                <div>
                  <label className="block text-[#ee5d4b] font-bold font-chakra mb-2 text-sm">
                    Gamer ID
                  </label>
                  <p className="text-white text-lg lg:text-xl font-semibold font-chakra">
                    {profileData.gamerId}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[#ee5d4b] font-bold font-chakra mb-2 text-sm">
                    Email Address
                  </label>
                  <p className="text-white text-lg lg:text-xl font-semibold font-chakra">
                    {profileData.email}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 animate-fadeIn">
            {isEditing ? (
              <div className="flex gap-4">
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-[#ee5d4b] text-black font-chakra font-bold hover:bg-[#d44c2a] transition-colors rounded-lg"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-700 transition-colors rounded-lg"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <></>
              // <Link href="/buy">
              //   <button className="px-6 py-2 bg-[#ee5d4b] text-[0.9rem] rounded-lg text-black font-chakra font-bold hover:bg-[#d44c2a] transition-colors">
              //     Buy Credits
              //   </button>
              // </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
