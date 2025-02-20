import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Camera, Shield, Mail, CheckCircle } from 'lucide-react';
import img from '../assets/Images/face.jpg';

const FaceVerification = () => {
    const [formData, setFormData] = useState({
        email: '',
        number: '',
        image: null,
    });
    const [uiState, setUiState] = useState({
        emailError: '',
        numberError: '',
        isLoading: false,
        error: '',
        isCameraActive: false,
        stream: null,
    });

    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setUiState(prev => ({ ...prev, emailError: 'Email is required' }));
            return false;
        }
        if (!emailRegex.test(email)) {
            setUiState(prev => ({ ...prev, emailError: 'Please enter a valid email' }));
            return false;
        }
        setUiState(prev => ({ ...prev, emailError: '' }));
        return true;
    };

    const validateNumber = (number) => {
        if (!number) {
            setUiState(prev => ({ ...prev, numberError: 'Number is required' }));
            return false;
        }
        if (isNaN(number) || number.length < 6) {
            setUiState(prev => ({ ...prev, numberError: 'Please enter a valid number (min 6 digits)' }));
            return false;
        }
        setUiState(prev => ({ ...prev, numberError: '' }));
        return true;
    };

    const handleCameraStop = useCallback(() => {
        if (uiState.stream) {
            uiState.stream.getTracks().forEach(track => track.stop());
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
            setUiState(prev => ({
                ...prev,
                stream: null,
                isCameraActive: false,
            }));
        }
    }, [uiState.stream]);

 const handleCameraStart = useCallback(async () => {
        try {
            if (uiState.stream) {
                handleCameraStop();  // Ensure any existing stream is stopped
            }

            const constraints = {
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'user',
                },
            };

            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                // Wait for video to be ready
                await new Promise((resolve) => {
                    videoRef.current.onloadedmetadata = () => {
                        resolve();
                    };
                });
                await videoRef.current.play();
            }

            setUiState(prev => ({
                ...prev,
                stream: mediaStream,
                isCameraActive: true,
                error: '',
            }));
        } catch (err) {
            console.error('Camera error:', err);
            setUiState(prev => ({
                ...prev,
                error: 'Camera access denied. Please check your permissions.',
            }));
        }
    }, [handleCameraStop, uiState.stream]);

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            const video = videoRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            try {
                const imageData = canvas.toDataURL('image/jpeg', 0.8);
                setFormData(prev => ({ ...prev, image: imageData }));
                handleCameraStop();
            } catch (err) {
                console.error('Capture error:', err);
                setUiState(prev => ({
                    ...prev,
                    error: 'Failed to capture image. Please try again.',
                }));
            }
        }
    };

    const handleRetake = () => {
        handleCameraStop(); // Stop the camera before retaking
        setFormData(prev => ({ ...prev, image: null }));
        handleCameraStart();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateEmail(formData.email) || !validateNumber(formData.number) || !formData.image) {
            setUiState(prev => ({
                ...prev,
                error: 'Please provide email, number, and facial image',
            }));
            return;
        }

        setUiState(prev => ({ ...prev, isLoading: true, error: '' }));
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log('Verification successful!');
        } catch (err) {
            setUiState(prev => ({
                ...prev,
                error: 'Verification failed. Please try again.', err
            }));
        } finally {
            setUiState(prev => ({ ...prev, isLoading: false }));
        }
    };

    useEffect(() => {
        let mounted = true;

        const initCamera = async () => {
            if (mounted && !formData.image && !uiState.stream) {
                await handleCameraStart();
            }
        };

        initCamera();

        return () => {
            mounted = false;
            handleCameraStop();
        };
    }, [formData.image, handleCameraStart, handleCameraStop, uiState.stream]);

    return (
        <div className="flex flex-col sm:flex-row w-full min-h-screen bg-gray-900">
            {/* Left side - Branding and Information */}
            <div className="w-full p-6 flex flex-col items-center text-white">
                <div className="max-w-lg">
                    <div className="flex items-center justify-center mb-6">
                        <Shield className="w-6 h-6 mr-2 text-blue-400" />
                        <h1 className="text-2xl font-bold">SecureID Verify</h1>
                    </div>

                    <img
                        src={img}
                        alt="Face Recognition Technology"
                        style={{
                            height: '60%',
                            width: '190%',
                        }}
                        className="w-full rounded-lg shadow-lg mb-6"
                    />

                    <div className="space-y-4">
                        <div className="bg-gray-800 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mb-3 text-blue-400">Secure Verification Process</h3>
                            <ul className="space-y-2">
                                <li className="flex items-start">
                                    <CheckCircle className="w-4 h-4 mr-2 text-blue-400 mt-1" />
                                    <span className="text-sm">Advanced facial recognition technology</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-4 h-4 mr-2 text-blue-400 mt-1" />
                                    <span className="text-sm">Bank-grade security protocols</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-4 h-4 mr-2 text-blue-400 mt-1" />
                                    <span className="text-sm">Instant verification process</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - Verification Form */}
            <div className="w-full bg-white p-6">
                <div className="max-w-md mx-auto">
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Identity Verification</h2>
                        <p className="text-gray-600 text-sm">Complete the verification process to continue</p>
                    </div>

                    {/* Camera Section */}
                    <div className="mb-4">
                        {!formData.image ? (
                            <div className="relative rounded-lg overflow-hidden bg-black">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full h-64 object-cover"
                                />
                                <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                                    <button
                                        type="button"
                                        onClick={handleCapture}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                                    >
                                        <Camera className="w-4 h-4 mr-2" />
                                        Capture
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="relative rounded-lg overflow-hidden bg-black">
                                <img
                                    src={formData.image}
                                    alt="Captured"
                                    className="w-full h-64 object-cover"
                                />
                                <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                                    <button
                                        type="button"
                                        onClick={handleRetake}
                                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
                                    >
                                        <Camera className="w-4 h-4 mr-2" />
                                        Retake Photo
                                    </button>
                                </div>
                            </div>
                        )}
                        <canvas ref={canvasRef} className="hidden" />
                    </div>

                    {/* Form Fields */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => {
                                        setFormData(prev => ({ ...prev, email: e.target.value }));
                                        validateEmail(e.target.value);
                                    }}
                                    placeholder="Enter your email"
                                    className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                            </div>
                            {uiState.emailError && (
                                <div className="text-red-500 text-xs mt-1">{uiState.emailError}</div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>
                            <div className="relative">
                                <input
                                    id="number"
                                    type="tel"
                                    value={formData.number}
                                    onChange={(e) => {
                                        setFormData(prev => ({ ...prev, number: e.target.value }));
                                        validateNumber(e.target.value);
                                    }}
                                    placeholder="Enter your phone number"
                                    className="pl-4 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                            </div>
                            {uiState.numberError && (
                                <div className="text-red-500 text-xs mt-1">{uiState.numberError}</div>
                            )}
                        </div>

                        {uiState.error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {uiState.error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={uiState.isLoading || !formData.email || !formData.number || !formData.image}
                            className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                            {uiState.isLoading ? (
                                'Verifying...'
                            ) : (
                                <>
                                    <Shield className="w-4 h-4 mr-2" />
                                    Complete Verification
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FaceVerification;
