'use client';

import { useRouter } from "next/navigation";
import { BiSearch } from "react-icons/bi";
import { HiHome } from "react-icons/hi";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { twMerge } from "tailwind-merge";
import Button from "./Button";
import { signOut } from "firebase/auth";
import { auth } from "@/app/firebase/config";
import { useEffect, useState } from "react";
import Modal from "./Modal";

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ children, className }) => {
  const [userName, setUserName] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = sessionStorage.getItem('userName');
      const storedProfilePicture = sessionStorage.getItem('profilePicture');
      if (storedName) {
        setUserName(storedName);
      }
      if (storedProfilePicture) {
        setProfilePicture(storedProfilePicture);
      }
    }
  }, []);

  const handleSignOut = () => {
    signOut(auth);
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('profilePicture');
    setUserName(null);
    setProfilePicture(null);
    router.push('/sign-in');
  };

  return (
    <div className={twMerge(`h-fit bg-gradient-to-b from-red-800 p-6`, className)}>
      <div className="w-full mb-4 flex items-center justify-between">
        <div className="hidden md:flex gap-x-2 items-center">
          <button onClick={() => router.back()} className="rounded-full bg-black flex items-center hover:opacity-75 transition">
            <RxCaretLeft size={35} className="text-white" />
          </button>
          <button onClick={() => router.forward()} className="rounded-full bg-black flex items-center hover:opacity-75 transition">
            <RxCaretRight size={35} className="text-white" />
          </button>
        </div>
        <div className="flex md:hidden gap-x-2 items-center">
          <button className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 transition">
            <HiHome className="text-black" size={20} />
          </button>
          <button className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 transition">
            <BiSearch className="text-black" size={20} />
          </button>
        </div>
        <div className="flex justify-between items-center gap-x-4">
          <>
            <div className="flex items-center gap-x-2 cursor-pointer" onClick={() => setIsModalOpen(true)}>
              <img src={profilePicture || "https://avatar.iran.liara.run/public"} alt="Profile" className="w-8 h-8 rounded-full" />
              <Button className="bg-transparent text-neutral-300 font-medium">
                {userName || 'User Name'}
              </Button>
            </div>
            <div>
              <Button onClick={handleSignOut} className="bg-white px-6 py-2 text-black">
                Log out
              </Button>
            </div>
          </>
        </div>
      </div>
      {children}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}

export default Header;
