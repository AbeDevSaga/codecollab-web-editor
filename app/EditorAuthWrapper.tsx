// components/EditorAuthWrapper.tsx
'use client'
import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './redux/store';
import { verifyToken } from './redux/slices/tokenSlice';
import { initializeWorkspace, setTerminalHeight } from './redux/slices/editorSlice';
import { useLoading } from './context/LoadingContext';
import { fetchAllFiles } from './redux/slices/fileSlice';
import { fetchAllChats } from './redux/slices/chatGroupSlice';
import { fileSocketService } from './sockets/fileSocketService';
import { videoSocketService } from './sockets/videoSocketService';

export default function EditorAuthWrapper({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const {setLoading} = useLoading(); 
  const { isVerified, error, user, isLoading } = useSelector((state: RootState) => state.token);
  const verificationAttempted = useRef(false);
  
  useEffect(() => {
    const token = searchParams.get('token');
    console.log('Token from URL:', token);
    console.log('Token verification flow:', { token, isVerified });
    if (!token) {
      console.error('No token found in URL');
      router.push('/unauthorized');
      return;
    }
    if (isVerified || verificationAttempted.current) return;
    if (!isVerified && !isLoading) {
      verificationAttempted.current = true;
      setLoading(true); // Set loading state to true
      dispatch(verifyToken(token)) .unwrap()
      .catch((err) => {
        console.error('Token verification failed:', err);
        router.push('/unauthorized');
      })
      .finally(() => setLoading(false));
    }
    else {
      setLoading(false); // Set loading state to false
    }
  }, [dispatch, isVerified, searchParams, router, setLoading, isLoading]);

  useEffect(() => {
    if (error) {
      router.push('/unauthorized');
    }
  }, [error, router]);

  useEffect(() => {
    if (isVerified && user) {
      // Initialize WebSocket connection
      const token = searchParams.get('token') || '';
      fileSocketService.connect(token);
      // Using _id for both workspaceId and userId
      dispatch(fetchAllFiles());
      dispatch(fetchAllChats());
      dispatch(initializeWorkspace({
        workspaceId: user._id,
        userId: user._id
      }));
      // Load saved preferences
      const savedHeight = localStorage.getItem(`terminalHeight-${user._id}`);
      if (savedHeight) {
        dispatch(setTerminalHeight(parseInt(savedHeight, 10)));
      }
      localStorage.setItem('editorToken', searchParams.get('token') || '');
    }
  }, [error, isVerified, user, dispatch, router, searchParams]);

  if (!isVerified) return <div>Loading editor...</div>;
  return <>{children}</>;
}