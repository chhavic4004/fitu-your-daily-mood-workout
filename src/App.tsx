import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Mood from "./pages/Mood";
import WorkoutSelect from "./pages/WorkoutSelect";
import WorkoutActive from "./pages/WorkoutActive";
import WorkoutSummary from "./pages/WorkoutSummary";
import MissedWorkout from "./pages/MissedWorkout";
import FailureReason from "./pages/FailureReason";
import FailureInsights from "./pages/FailureInsights";
import Progress from "./pages/Progress";
import MoodAnalytics from "./pages/MoodAnalytics";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mood" element={<Mood />} />
          <Route path="/workout-select" element={<WorkoutSelect />} />
          <Route path="/workout-active/:workoutId" element={<WorkoutActive />} />
          <Route path="/workout-summary/:workoutId" element={<WorkoutSummary />} />
          <Route path="/missed-workout" element={<MissedWorkout />} />
          <Route path="/failure-reason/:category" element={<FailureReason />} />
          <Route path="/failure-insights" element={<FailureInsights />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/mood-analytics" element={<MoodAnalytics />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
