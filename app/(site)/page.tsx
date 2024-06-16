'use client';

import Header from "@/components/Header";
import ListItem from "@/components/Listitem";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/app/firebase/config';
import { FaPlay, FaPause } from "react-icons/fa";
import Modal from 'react-modal';

interface Song {
  id: string;
  title: string;
  artist: string;
  description: string;
  image: string;
  music: string;
  wins: number;
}

const Home = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  const [user] = useAuthState(auth);
  const router = useRouter();
  const userSession = typeof window !== "undefined" ? sessionStorage.getItem('userName') : null;

  useEffect(() => {
    if (!user && !userSession) {
      router.push('/sign-in');
    }
  }, [user, userSession, router]);

  if (!user && !userSession) {
    return null;
  };

  useEffect(() => {
    const fetchSongs = async () => {
      const querySnapshot = await getDocs(collection(db, 'songs'));
      const songsList: Song[] = [];
      querySnapshot.forEach((doc) => {
        songsList.push({ id: doc.id, ...doc.data() } as Song);
      });
      setSongs(songsList);
      setFilteredSongs(songsList);
    };

    fetchSongs();
  }, []);

  useEffect(() => {
    const filtered = songs.filter((song) =>
      song.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSongs(filtered);
  }, [searchTerm, songs]);

  const playMusic = (url: string) => {
    if (currentAudio) {
      currentAudio.pause();
    }
    const audio = new Audio(url);
    audio.currentTime = currentTime;
    audio.play();
    setCurrentAudio(audio);
  };

  const pauseMusic = () => {
    if (currentAudio) {
      setCurrentTime(currentAudio.currentTime);
      currentAudio.pause();
    }
  };

  const showDetails = (song: Song) => {
    setSelectedSong(song);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedSong(null);
  };

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
        <div className="mb-2">
          <h1 className="text-white text-3xl font-semibold">Welcome to N! Music</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 mt-4">
            <ListItem image="/images/liked.png" name="Favourites" href="liked" />
          </div>
        </div>
      </Header>
      <div className="mt-2 mb-7 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-2xl font-semibold">Eternal Songs</h1>
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by title..."
            className="p-2 rounded-lg w-1/3 mt-3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <h1 className="my-7">List of Songs</h1>
          <ul>
            {filteredSongs.map((song) => (
              <li key={song.id} onClick={() => showDetails(song)} className="cursor-pointer">
                <div className="flex justify-between w-4/5 pb-3 border-b mt-7 border-red-500 items-center">
                  <div className="flex">
                    <img src={song.image} alt={song.title} style={{ width: 100, height: 100 }} />
                    <div className="ml-7">
                      <h2><span className="text-red-500 font-semibold">Song:</span>  {song.title}</h2>
                      <p className="pt-3"><span className="text-red-500 font-semibold">Artist:</span>  {song.artist}</p>
                    </div>
                  </div>
                  <div className="mb-8 flex items-center">
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        pauseMusic();
                      }} 
                      className="ml-12 transition rounded-full flex items-center justify-center bg-red-500 p-3 drop-shadow-md  group-hover:opacity-100 hover:scale-110 cursor-pointer"
                    >
                      <FaPause size={15} className="text-black" />
                    </div>
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        playMusic(song.music);
                      }}  
                      className="transition rounded-full flex items-center justify-center bg-red-500 drop-shadow-md hover:scale-110 cursor-pointer p-3" 
                      style={{ width: '40px', height: '40px' }}
                    >
                      <FaPlay size={15} className="text-white" />
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Song Details"
        className="bg-neutral-200 rounded-lg p-8 shadow-lg w-2/4 mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        {selectedSong && (
          <div className="text-black">
            <h2 className="text-2xl font-semibold mb-4">{selectedSong.title}</h2>
            <p className="mb-2"><strong>Artist:</strong> {selectedSong.artist}</p>
            <p className="mb-2"><strong>Description:</strong> {selectedSong.description}</p>
            <p className="mb-2"><strong>Wins:</strong> {selectedSong.wins}</p>
            <div className="w-1/2 mx-auto">
              <img src={selectedSong.image} alt={selectedSong.title} className="w-full h-auto rounded-lg mb-4" />
            </div>
            <button onClick={closeModal} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">Close</button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Home;
