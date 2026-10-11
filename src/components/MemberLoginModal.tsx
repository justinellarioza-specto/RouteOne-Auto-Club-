import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Lock,
  User,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  LogOut,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useMember } from '../context/MemberContext';
import { MyBookings } from './MyBookings';
import { useTheme } from '../context/ThemeContext';

export const MemberLoginModal: React.FC<{
  onNavigate?: (tab: string) => void;
}> = ({ onNavigate }) => {
  const {
    isMember,
    isAdmin,
    memberProfile,
    isLoginModalOpen,
    closeLoginModal,
    login,
    signUp,
    logout,
  } = useMember();
  const { isGarageLight } = useTheme();

  // Mode: 'login' | 'signup' | 'forgot'
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');

  // Login form inputs
  const [loginId, setLoginId] = useState<string>('user');
  const [loginPassword, setLoginPassword] = useState<string>('user');
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [showLoginPassword, setShowLoginPassword] = useState<boolean>(false);

  // Sign up form inputs
  const [signUpName, setSignUpName] = useState<string>('');
  const [signUpId, setSignUpId] = useState<string>('');
  const [signUpPassword, setSignUpPassword] = useState<string>('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState<string>('');
  const [showSignUpPassword, setShowSignUpPassword] = useState<boolean>(false);

  // Forgot password inputs
  const [forgotId, setForgotId] = useState<string>('');
  const [forgotSubmitted, setForgotSubmitted] = useState<boolean>(false);

  // Status feedback
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Reset errors and states when modal opens
  useEffect(() => {
    if (isLoginModalOpen) {
      setErrorMessage(null);
      setForgotSubmitted(false);
      setIsSubmitting(false);
      if (!isMember) {
        setAuthMode('login');
      }
    }
  }, [isLoginModalOpen, isMember]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLoginModalOpen) {
        closeLoginModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLoginModalOpen, closeLoginModal]);

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!loginId.trim()) {
      setErrorMessage('Please enter your Login ID or Email.');
      return;
    }

    if (!loginPassword.trim()) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(loginId.trim(), loginPassword);
    } catch (err) {
      setErrorMessage(err instanceof Error && err.message ? err.message : 'Wrong login ID or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Sign Up Submit
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!signUpName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!signUpId.trim()) {
      setErrorMessage('Please enter a Login ID or Email.');
      return;
    }

    if (signUpPassword.length < 8) {
      setErrorMessage('Use at least 8 characters for your password.');
      return;
    }

    if (signUpPassword !== signUpConfirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await signUp(signUpName.trim(), signUpId.trim(), signUpPassword);
    } catch (err) {
      setErrorMessage(err instanceof Error && err.message ? err.message : 'Your account could not be created. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Forgot Password Submit
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!forgotId.trim()) {
      setErrorMessage('Please enter your Login ID or Email.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setForgotSubmitted(true);
    }, 400);
  };

  if (!isLoginModalOpen) return null;

  return (
    <AnimatePresence>
      <div
        id="member-login-modal-portal"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="member-modal-title"
      >
        {/* Backdrop click dismiss */}
        <div
          className="fixed inset-0"
          onClick={closeLoginModal}
          aria-hidden="true"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 14 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className={`relative z-10 w-full ${isMember ? 'max-w-lg' : 'max-w-md'} border shadow-2xl overflow-hidden rounded-xs transition-colors duration-200 ${
            isGarageLight
              ? 'bg-white border-black/15 text-[#101214]'
              : 'bg-[#101214] border-white/15 text-[#F4F3EF]'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Brand & Close Header */}
          <div
            className={`px-5 sm:px-6 py-4 border-b flex items-center justify-between ${
              isGarageLight ? 'border-black/10 bg-[#F9F9F8]' : 'border-white/10 bg-[#15181B]'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D71920]" />
              <span className="font-heading font-bold text-sm ">
                RouteOne
              </span>
              <span className="text-xs text-[#85898A] ">
                {isMember ? 'My account' : 'Member login'}
              </span>
            </div>

            <button
              id="close-member-modal-btn"
              onClick={closeLoginModal}
              aria-label="Close modal"
              className={`p-1.5 transition-colors cursor-pointer rounded-xs ${
                isGarageLight
                  ? 'text-[#565C62] hover:text-[#101214] hover:bg-black/5'
                  : 'text-[#85898A] hover:text-white hover:bg-white/5'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* =========================================================================
              STATE A: LOGGED IN VIEW (Simple Account Dossier & Logout)
             ========================================================================= */}
          {isMember ? (
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-[#D71920]/15 border border-[#D71920]/40 flex items-center justify-center text-[#D71920] shrink-0 font-bold text-lg ">
                  {memberProfile.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#D71920] font-bold ">
                      {memberProfile.tier}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  </div>
                  <h2
                    id="member-modal-title"
                    className="font-heading text-lg font-bold truncate"
                  >
                    {memberProfile.name}
                  </h2>
                  <p className="text-xs text-[#85898A] truncate">
                    {memberProfile.email}
                  </p>
                </div>
              </div>

              {/* Account Quick Stats */}
              <div
                className={`p-3.5 border rounded-xs grid grid-cols-2 gap-3 text-xs ${
                  isGarageLight ? 'bg-black/[0.02] border-black/10' : 'bg-white/[0.02] border-white/10'
                }`}
              >
                <div>
                  <span className="text-xs text-[#85898A] block ">
                    Member ID
                  </span>
                  <span className=" font-semibold">{memberProfile.id}</span>
                </div>
                <div>
                  <span className="text-xs text-[#85898A] block ">
                    Track days left
                  </span>
                  <span className=" font-semibold text-[#D71920]">
                    {memberProfile.trackDaysRemaining} days
                  </span>
                </div>
                <div>
                  <span className="text-xs text-[#85898A] block ">
                    Assigned fleet
                  </span>
                  <span className=" font-semibold">
                    {memberProfile.allocatedCars.length} supercars
                  </span>
                </div>
                <div>
                  <span className="text-xs text-[#85898A] block ">
                    Paddock clearance
                  </span>
                  <span className=" font-semibold text-[#10B981]">Active</span>
                </div>
              </div>

              {/* The member's own inquiries and bookings (GET /api/customers?email=) */}
              <MyBookings
                email={memberProfile.email}
                onBookNew={
                  onNavigate
                    ? () => {
                        closeLoginModal();
                        onNavigate('contact');
                      }
                    : undefined
                }
              />

              {/* Admin Privileges Banner if Admin */}
              {isAdmin && (
                <div className="p-3 bg-[#D71920]/15 border border-[#D71920]/50 rounded-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                  <div className="text-left ">
                    <span className="text-xs text-[#D71920] font-bold block ">
                      FIA race director privileges active
                    </span>
                    <span className="text-[11px] text-[#AEB4B5]">
                      Full circuit dispatch, supercar asset inventory & booking analytics.
                    </span>
                  </div>
                  {onNavigate && (
                    <button
                      onClick={() => {
                        closeLoginModal();
                        onNavigate('admin');
                      }}
                      className="px-3 py-1.5 bg-[#D71920] hover:bg-[#B5141A] text-white text-[11px] font-bold rounded-xs transition-all cursor-pointer shadow-[0_0_10px_rgba(215,25,32,0.4)] shrink-0"
                    >
                      Open admin dashboard
                    </button>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  id="btn-member-signout"
                  onClick={logout}
                  className="flex-1 py-2.5 px-4 border border-[#D71920] text-[#D71920] hover:bg-[#D71920] hover:text-white transition-all text-xs font-bold rounded-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log out</span>
                </button>
                <button
                  onClick={closeLoginModal}
                  className={`flex-1 py-2.5 px-4 border text-xs font-bold rounded-xs transition-colors cursor-pointer ${
                    isGarageLight
                      ? 'border-black/20 hover:bg-black/5 text-[#101214]'
                      : 'border-white/20 hover:bg-white/5 text-white'
                  }`}
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* =========================================================================
               STATE B: AUTHENTICATION FLOW (Log In, Sign Up, Forgot Password)
               ========================================================================= */
            <div>
              {/* Simple Tab Header for Login & Sign Up */}
              {authMode !== 'forgot' && (
                <div
                  className={`flex border-b text-xs ${
                    isGarageLight ? 'border-black/10 bg-black/[0.02]' : 'border-white/10 bg-white/[0.02]'
                  }`}
                >
                  <button
                    id="tab-login-btn"
                    onClick={() => {
                      setAuthMode('login');
                      setErrorMessage(null);
                    }}
                    className={`flex-1 py-3 text-center font-bold transition-all cursor-pointer relative ${
                      authMode === 'login'
                        ? 'text-[#D71920]'
                        : isGarageLight
                        ? 'text-[#565C62] hover:text-[#101214]'
                        : 'text-[#85898A] hover:text-white'
                    }`}
                  >
                    Log in
                    {authMode === 'login' && (
                      <motion.div
                        layoutId="activeAuthTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D71920]"
                      />
                    )}
                  </button>

                  <button
                    id="tab-signup-btn"
                    onClick={() => {
                      setAuthMode('signup');
                      setErrorMessage(null);
                    }}
                    className={`flex-1 py-3 text-center font-bold transition-all cursor-pointer relative ${
                      authMode === 'signup'
                        ? 'text-[#D71920]'
                        : isGarageLight
                        ? 'text-[#565C62] hover:text-[#101214]'
                        : 'text-[#85898A] hover:text-white'
                    }`}
                  >
                    Sign up
                    {authMode === 'signup' && (
                      <motion.div
                        layoutId="activeAuthTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D71920]"
                      />
                    )}
                  </button>
                </div>
              )}

              <div className="p-6">
                {/* Error Banner */}
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 bg-[#D71920]/10 border border-[#D71920]/40 rounded-xs flex items-center gap-2 text-xs text-[#D71920]"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </motion.div>
                )}

                {/* 1. LOG IN VIEW */}
                {authMode === 'login' && (
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                      <h2
                        id="member-modal-title"
                        className="text-lg font-heading font-bold"
                      >
                        Welcome back
                      </h2>
                      <p className="text-xs text-[#85898A]">
                        Log in to book cars and manage your track days.
                      </p>
                    </div>

                    {/* Login ID Input */}
                    <div className="space-y-1">
                      <label className="block text-[11px] text-[#85898A] ">
                        Login ID or Email
                      </label>
                      <div className="relative">
                        <input
                          id="login-id-input"
                          type="text"
                          required
                          value={loginId}
                          onChange={(e) => setLoginId(e.target.value)}
                          placeholder="e.g. user"
                          className={`w-full pl-9 pr-3 py-2.5 text-xs rounded-xs border transition-colors outline-none ${
                            isGarageLight
                              ? 'bg-white border-black/20 focus:border-[#D71920] text-[#101214]'
                              : 'bg-black/40 border-white/15 focus:border-[#D71920] text-[#F4F3EF]'
                          }`}
                        />
                        <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#85898A]" />
                      </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] text-[#85898A] ">
                          Password
                        </label>
                        <button
                          type="button"
                          id="link-forgot-password"
                          onClick={() => {
                            setForgotId(loginId);
                            setAuthMode('forgot');
                            setErrorMessage(null);
                            setForgotSubmitted(false);
                          }}
                          className="text-[11px] text-[#D71920] hover:underline cursor-pointer"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          id="login-password-input"
                          type={showLoginPassword ? 'text' : 'password'}
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="e.g. user"
                          className={`w-full pl-9 pr-10 py-2.5 text-xs rounded-xs border transition-colors outline-none ${
                            isGarageLight
                              ? 'bg-white border-black/20 focus:border-[#D71920] text-[#101214]'
                              : 'bg-black/40 border-white/15 focus:border-[#D71920] text-[#F4F3EF]'
                          }`}
                        />
                        <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#85898A]" />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#85898A] hover:text-white"
                          title={showLoginPassword ? 'Hide password' : 'Show password'}
                        >
                          {showLoginPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Demo accounts: one tap fills the login form; the chosen account is highlighted */}
                    <div className="space-y-2">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-[11px] text-[#85898A]">
                          Demo account
                        </span>
                        <span className="text-[11px] text-[#85898A]">Tap to fill in the login</span>
                      </div>
                      {/* Staff (admin) accounts are not advertised here; they log in with their own ID above */}
                      <div className="grid grid-cols-1 gap-2" role="radiogroup" aria-label="Demo account">
                        {[{ id: 'user', title: 'Member', desc: 'Browse as a club member' }].map((acct) => {
                          const selected = loginId === acct.id && loginPassword === acct.id;
                          return (
                            <button
                              key={acct.id}
                              type="button"
                              role="radio"
                              aria-checked={selected}
                              onClick={() => {
                                setLoginId(acct.id);
                                setLoginPassword(acct.id);
                                setErrorMessage(null);
                              }}
                              className={`relative p-3 border rounded-md text-left transition-all cursor-pointer ${
                                selected
                                  ? 'border-[#D71920] bg-[#D71920]/[0.07] ring-1 ring-[#D71920]'
                                  : isGarageLight
                                  ? 'border-black/15 bg-white hover:border-black/30'
                                  : 'border-white/15 bg-white/[0.03] hover:border-white/30'
                              }`}
                            >
                              {selected && (
                                <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#D71920] text-white flex items-center justify-center">
                                  <Check className="w-3 h-3" strokeWidth={3} />
                                </span>
                              )}
                              <span className={`block text-sm font-semibold ${selected ? 'text-[#D71920]' : ''}`}>
                                {acct.title}
                              </span>
                              <span className="block text-[11px] text-[#85898A] mt-0.5 pr-4">{acct.desc}</span>
                              <span className="block text-[11px] text-[#85898A] mt-1.5">
                                {acct.id} / {acct.id}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Remember me option */}
                    <div className="flex items-center gap-2 pt-0.5">
                      <input
                        type="checkbox"
                        id="remember-me-checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-3.5 h-3.5 accent-[#D71920] rounded-xs cursor-pointer"
                      />
                      <label
                        htmlFor="remember-me-checkbox"
                        className="text-xs text-[#85898A] select-none cursor-pointer"
                      >
                        Keep me signed in on this device
                      </label>
                    </div>

                    {/* Submit Log In Button */}
                    <button
                      id="btn-submit-login"
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 bg-[#D71920] hover:bg-[#B5141A] disabled:opacity-60 text-white text-xs font-bold rounded-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(215,25,32,0.25)] active:scale-[0.99]"
                    >
                      {isSubmitting ? (
                        <span>Signing In...</span>
                      ) : (
                        <>
                          <span>Log in</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>

                    {/* Bottom Prompt */}
                    <p className="text-xs text-center text-[#85898A] pt-2">
                      Don't have an account yet?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('signup');
                          setErrorMessage(null);
                        }}
                        className="text-[#D71920] font-semibold hover:underline cursor-pointer"
                      >
                        Sign up
                      </button>
                    </p>
                  </form>
                )}

                {/* 2. SIGN UP VIEW */}
                {authMode === 'signup' && (
                  <form onSubmit={handleSignUpSubmit} className="space-y-4">
                    <div>
                      <h2 className="text-lg font-heading font-bold">
                        Create an Account
                      </h2>
                      <p className="text-xs text-[#85898A]">
                        Join the RouteOne private driver collective today.
                      </p>
                    </div>

                    {/* Name */}
                    <div className="space-y-1">
                      <label className="block text-[11px] text-[#85898A] ">
                        Full Name
                      </label>
                      <div className="relative">
                        <input
                          id="signup-name-input"
                          type="text"
                          required
                          value={signUpName}
                          onChange={(e) => setSignUpName(e.target.value)}
                          placeholder="e.g. Elena Rostova"
                          className={`w-full pl-9 pr-3 py-2 text-xs rounded-xs border transition-colors outline-none ${
                            isGarageLight
                              ? 'bg-white border-black/20 focus:border-[#D71920] text-[#101214]'
                              : 'bg-black/40 border-white/15 focus:border-[#D71920] text-[#F4F3EF]'
                          }`}
                        />
                        <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#85898A]" />
                      </div>
                    </div>

                    {/* Login ID / Email */}
                    <div className="space-y-1">
                      <label className="block text-[11px] text-[#85898A] ">
                        Login ID or Email
                      </label>
                      <div className="relative">
                        <input
                          id="signup-id-input"
                          type="text"
                          required
                          value={signUpId}
                          onChange={(e) => setSignUpId(e.target.value)}
                          placeholder="e.g. elena@example.com"
                          className={`w-full pl-9 pr-3 py-2 text-xs rounded-xs border transition-colors outline-none ${
                            isGarageLight
                              ? 'bg-white border-black/20 focus:border-[#D71920] text-[#101214]'
                              : 'bg-black/40 border-white/15 focus:border-[#D71920] text-[#F4F3EF]'
                          }`}
                        />
                        <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#85898A]" />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                      <label className="block text-[11px] text-[#85898A] ">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          id="signup-password-input"
                          type={showSignUpPassword ? 'text' : 'password'}
                          required
                          value={signUpPassword}
                          onChange={(e) => setSignUpPassword(e.target.value)}
                          placeholder="At least 8 characters"
                          className={`w-full pl-9 pr-10 py-2 text-xs rounded-xs border transition-colors outline-none ${
                            isGarageLight
                              ? 'bg-white border-black/20 focus:border-[#D71920] text-[#101214]'
                              : 'bg-black/40 border-white/15 focus:border-[#D71920] text-[#F4F3EF]'
                          }`}
                        />
                        <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#85898A]" />
                        <button
                          type="button"
                          onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#85898A] hover:text-white"
                        >
                          {showSignUpPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1">
                      <label className="block text-[11px] text-[#85898A] ">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          id="signup-confirm-password-input"
                          type={showSignUpPassword ? 'text' : 'password'}
                          required
                          value={signUpConfirmPassword}
                          onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                          placeholder="Repeat your password"
                          className={`w-full pl-9 pr-3 py-2 text-xs rounded-xs border transition-colors outline-none ${
                            isGarageLight
                              ? 'bg-white border-black/20 focus:border-[#D71920] text-[#101214]'
                              : 'bg-black/40 border-white/15 focus:border-[#D71920] text-[#F4F3EF]'
                          }`}
                        />
                        <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#85898A]" />
                      </div>
                    </div>

                    {/* Submit Sign Up Button */}
                    <button
                      id="btn-submit-signup"
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 bg-[#D71920] hover:bg-[#B5141A] disabled:opacity-60 text-white text-xs font-bold rounded-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(215,25,32,0.25)] active:scale-[0.99]"
                    >
                      {isSubmitting ? (
                        <span>Creating Account...</span>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>Create Account</span>
                        </>
                      )}
                    </button>

                    {/* Bottom Prompt */}
                    <p className="text-xs text-center text-[#85898A] pt-2">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('login');
                          setErrorMessage(null);
                        }}
                        className="text-[#D71920] font-semibold hover:underline cursor-pointer"
                      >
                        Log in
                      </button>
                    </p>
                  </form>
                )}

                {/* 3. FORGOT PASSWORD VIEW */}
                {authMode === 'forgot' && (
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-lg font-heading font-bold">
                        Reset Password
                      </h2>
                      <p className="text-xs text-[#85898A]">
                        Enter your Login ID or Email and we'll send you recovery instructions.
                      </p>
                    </div>

                    {forgotSubmitted ? (
                      <div className="space-y-4 py-2">
                        <div className="p-4 bg-[#10B981]/10 border border-[#10B981]/30 rounded-xs space-y-2 text-xs">
                          <div className="flex items-center gap-2 font-bold text-[#10B981]">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Recovery Link Sent</span>
                          </div>
                          <p className="text-[#85898A]">
                            Instructions have been sent to{' '}
                            <strong className="text-white">{forgotId}</strong>.
                          </p>
                          <div className="pt-2 border-t border-[#10B981]/20 text-[11px] text-[#AEB4B5]">
                            Demo quick recovery passkey: <span className="text-[#D71920] font-bold">apex2026</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode('login');
                            setLoginId(forgotId);
                            setLoginPassword('apex2026');
                          }}
                          className="w-full py-2.5 bg-[#D71920] hover:bg-[#B5141A] text-white text-xs font-bold rounded-xs transition-all cursor-pointer text-center"
                        >
                          Back to log in
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleForgotSubmit} className="space-y-4">
                        <div className="space-y-1">
                          <label className="block text-[11px] text-[#85898A] ">
                            Login ID or Email
                          </label>
                          <div className="relative">
                            <input
                              id="forgot-id-input"
                              type="text"
                              required
                              value={forgotId}
                              onChange={(e) => setForgotId(e.target.value)}
                              placeholder="e.g. member ID or name@example.com"
                              className={`w-full pl-9 pr-3 py-2.5 text-xs rounded-xs border transition-colors outline-none ${
                                isGarageLight
                                  ? 'bg-white border-black/20 focus:border-[#D71920] text-[#101214]'
                                  : 'bg-black/40 border-white/15 focus:border-[#D71920] text-[#F4F3EF]'
                              }`}
                            />
                            <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#85898A]" />
                          </div>
                        </div>

                        <button
                          id="btn-send-reset-code"
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-3 bg-[#D71920] hover:bg-[#B5141A] disabled:opacity-60 text-white text-xs font-bold rounded-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          {isSubmitting ? (
                            <span>Sending Instructions...</span>
                          ) : (
                            <span>Send Reset Instructions</span>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode('login');
                            setErrorMessage(null);
                          }}
                          className="w-full py-2 text-xs text-[#85898A] hover:text-white transition-colors cursor-pointer text-center"
                        >
                          Cancel and go back to log in
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
