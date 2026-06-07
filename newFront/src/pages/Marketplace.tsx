import React from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  Users, 
  ShoppingCart,
  ChevronDown
} from 'lucide-react';
import { AppLayout } from '@/components/educhain/layout';
import { NFTTypePill, VerifiedStudentBadge } from '@/components/educhain/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const courses = [
  {
    id: 1,
    title: "Introduction to Solana Program Development",
    instructor: "Dr. Ifeanyi",
    rating: 4.8,
    students: "1.2k",
    price: 0.5,
    type: "NFT",
    category: "Blockchain",
    image: "https://picsum.photos/seed/solana/400/250"
  },
  {
    id: 2,
    title: "Advanced React 19 Patterns with AI",
    instructor: "Engr. Funke",
    rating: 4.9,
    students: "850",
    price: 0.8,
    type: "SFT",
    category: "Web Dev",
    image: "https://picsum.photos/seed/react/400/250"
  },
  {
    id: 3,
    title: "Cybersecurity Essentials for Fintech",
    instructor: "Prof. Ibrahim",
    rating: 4.7,
    students: "2.1k",
    price: 0.4,
    type: "NFT",
    category: "Security",
    image: "https://picsum.photos/seed/cyber/400/250"
  },
  {
    id: 4,
    title: "Digital Economy & Web3 Governance",
    instructor: "Dr. Chioma",
    rating: 4.6,
    students: "420",
    price: 0.3,
    type: "SFT",
    category: "Policy",
    image: "https://picsum.photos/seed/gov/400/250"
  },
  {
    id: 5,
    title: "Mobile App Development with Flutter",
    instructor: "Engr. David",
    rating: 4.9,
    students: "1.5k",
    price: 0.6,
    type: "NFT",
    category: "Mobile",
    image: "https://picsum.photos/seed/mobile/400/250"
  },
  {
    id: 6,
    title: "Data Science with Python & Big Data",
    instructor: "Prof. Tunde",
    rating: 4.8,
    students: "3.2k",
    price: 0.7,
    type: "NFT",
    category: "Data",
    image: "https://picsum.photos/seed/data/400/250"
  }
];

export const Marketplace = () => {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">Course Marketplace</h1>
            <p className="text-muted-foreground">Expand your knowledge with blockchain-verified academic content.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-border gap-2">
              <Filter size={16} /> Filters
            </Button>
            <Button variant="outline" className="border-border gap-2">
              Sort by: Recommended <ChevronDown size={16} />
            </Button>
          </div>
        </div>

        {/* Search & Categories */}
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input 
              placeholder="Search for courses, instructors, or institutions..." 
              className="h-14 pl-12 bg-card border-border text-lg focus:ring-primary/50"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {["All Categories", "Blockchain", "Web Dev", "Security", "Policy", "Data Science", "Mobile", "UI/UX"].map((cat, i) => (
              <Badge 
                key={cat} 
                variant={i === 0 ? "default" : "outline"}
                className={cn(
                  "px-4 py-1.5 rounded-full text-[12px] font-medium cursor-pointer transition-colors",
                  i === 0 ? "bg-primary hover:bg-primary/90" : "bg-card border-border hover:border-primary/50"
                )}
              >
                {cat}
              </Badge>
            ))}
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div key={course.id} className="bg-card border border-border rounded-xl overflow-hidden card-hover group">
              <div className="h-48 relative overflow-hidden">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <NFTTypePill type={course.type as any} />
                  <Badge className="bg-background/80 backdrop-blur-sm text-foreground border-white/10 text-[10px] font-bold">
                    {course.category}
                  </Badge>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <h3 className="font-bold text-lg leading-tight line-clamp-2 min-h-[56px] group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] text-muted-foreground">{course.instructor}</span>
                    <VerifiedStudentBadge className="scale-90" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-[12px] text-muted-foreground pb-4 border-b border-border">
                  <div className="flex items-center gap-1 text-warning">
                    <Star size={14} fill="currentColor" />
                    <span className="font-bold text-foreground">{course.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={14} />
                    <span>{course.students} students</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1.5">
                    <img src="https://cryptologos.cc/logos/solana-sol-logo.png" className="w-4 h-4" alt="SOL" />
                    <span className="font-bold text-lg">{course.price} SOL</span>
                    <span className="text-[12px] text-muted-foreground ml-1">(${(course.price * 145).toFixed(2)})</span>
                  </div>
                  <Button size="sm" className="bg-primary text-white hover:bg-primary/90">
                    Enroll <ShoppingCart className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};