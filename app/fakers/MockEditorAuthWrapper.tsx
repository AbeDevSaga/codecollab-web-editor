// components/MockEditorAuthWrapper.tsx
'use client'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeWorkspace, setTerminalHeight } from '../redux/slices/editorSlice';
import { useLoading } from '../context/LoadingContext';
import { fetchAllFiles } from '../redux/slices/fileSlice';
import { AppDispatch } from '../redux/store';

export default function MockEditorAuthWrapper({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(true);
    
    // Simulate token verification delay
    const timer = setTimeout(() => {
      // Mock user data
      const mockUser = {
        _id: 'mock-user-id-123',
        name: 'Test User',
        email: 'test@example.com'
      };

      // Initialize with mock data
      dispatch(fetchAllFiles());
      dispatch(initializeWorkspace({
        workspaceId: mockUser._id,
        userId: mockUser._id
      }));

      // Set default terminal height
      dispatch(setTerminalHeight(200));
      
      setLoading(false);
    }, 500); // Short delay to simulate network request

    return () => clearTimeout(timer);
  }, [dispatch, setLoading]);

  return <>{children}</>;
}