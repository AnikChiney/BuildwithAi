import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { CitizenRequestPage } from './pages/CitizenRequestPage';
import { SubmissionStatusPage } from './pages/SubmissionStatusPage';
import { GovernmentPage } from './pages/GovernmentPage';
import { MethodPage } from './pages/MethodPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const AppRoutes: React.FC = () => <Routes>
  <Route path="/" element={<LandingPage/>}/>
  <Route path="/submit" element={<CitizenRequestPage/>}/>
  <Route path="/submit/:requestId" element={<SubmissionStatusPage/>}/>
  <Route path="/government/*" element={<GovernmentPage/>}/>
  <Route path="/method" element={<MethodPage/>}/>
  <Route path="/dashboard/*" element={<Navigate to="/government" replace/>}/>
  <Route path="*" element={<NotFoundPage/>}/>
</Routes>;
