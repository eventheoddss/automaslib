"use client"

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import toast from 'react-hot-toast';
import { Bookmark, BookmarkX } from 'lucide-react';

interface BookmarkButtonProps {
  bookId: string;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({ bookId }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const toggleBookmark = async () => {
    try {
      if (isBookmarked) {
        await axios.delete(`/api/bookmarks/${bookId}`);
        toast.success("Bookmark removed");
      } else {
        await axios.post(`/api/bookmarks/${bookId}`);
        toast.success("Bookmark added");
      }

      setIsBookmarked((prev) => !prev);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  useEffect(() => {
    // Load bookmark state from localStorage on component mount
    const storedBookmark = localStorage.getItem(`bookmark-${bookId}`);
    if (storedBookmark) {
      setIsBookmarked(JSON.parse(storedBookmark));
    }
  }, [bookId]);

  useEffect(() => {
    // Save bookmark state to localStorage when it changes
    localStorage.setItem(`bookmark-${bookId}`, JSON.stringify(isBookmarked));
  }, [bookId, isBookmarked]);

  return (
    <div onClick={toggleBookmark} className="cursor-pointer">
      {!isBookmarked ? (
        <Button>
          <Bookmark className="h-4 w-4 mr-2" />
          Add to Bookmarks
        </Button>
      ) : (
        <Button>
          <BookmarkX className="h-4 w-4 mr-2" />
          Remove Bookmark
        </Button>
      )}
    </div>
  );
};

export default BookmarkButton;
