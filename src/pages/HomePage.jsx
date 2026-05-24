import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Pill, Truck, ShieldCheck, Clock, HeartPulse, ArrowRight, Sparkles, Baby, Heart, Activity } from 'lucide-react';

function HomePage() {
  const { user } = useAuth();

  const features = [
    { icon: Truck, title: 'Fast Delivery', description: 'Get your medicines delivered to your doorstep within hours', color: 'from-blue-500 to-cyan-500' },
    { icon: ShieldCheck, title: 'Authentic Products', description: 'All our medicines are 100% genuine and properly stored', color: 'from-green-500 to-emerald-500' },
    { icon: Clock, title: '24/7 Available', description: 'Order anytime, day or night. We are always here for you', color: 'from-purple-500 to-pink-500' },
    { icon: HeartPulse, title: 'Expert Consultation', description: 'Get professional advice from our certified pharmacists', color: 'from-orange-500 to-red-500' },
  ];

  const categories = [
    { icon: Pill, name: 'Medicines', count: '500+', color: 'bg-blue-50 text-blue-600' },
    { icon: Heart, name: 'Personal Care', count: '200+', color: 'bg-pink-50 text-pink-600' },
    { icon: Activity, name: 'Vitamins', count: '150+', color: 'bg-green-50 text-green-600' },
    { icon: Baby, name: 'Baby Care', count: '100+', color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-cyan-50/30 to-blue-50/30">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                <span>Welcome to Alansar Pharmacy</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Your Health is <span className="text-gradient-pharmacy">Our Priority</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl">
                Discover a wide range of medicines, health products, and wellness essentials. Quality care delivered right to your door.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3 gradient-pharmacy text-white rounded-xl font-semibold shadow-pharmacy hover:shadow-pharmacy-lg transition-all hover:scale-105">
                  Shop Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
                {!user && (
                  <Link to="/register" className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-primary text-primary rounded-xl font-semibold hover:bg-primary hover:text-white transition-all">
                    Create Account
                  </Link>
                )}
              </div>
              <div className="flex items-center gap-6 mt-8 justify-center md:justify-start">
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-secondary">10K+</div>
                  <div className="text-sm text-muted-foreground">Happy Customers</div>
                </div>
                <div className="w-px h-12 bg-border"></div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-secondary">1000+</div>
                  <div className="text-sm text-muted-foreground">Products</div>
                </div>
                <div className="w-px h-12 bg-border"></div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-secondary">24/7</div>
                  <div className="text-sm text-muted-foreground">Support</div>
                </div>
              </div>
            </div>
            <div className="relative flex justify-center">
              <div className="relative w-72 h-72 md:w-96 md:h-96">
                <div className="absolute inset-0 gradient-pharmacy rounded-full opacity-20 blur-3xl animate-pulse"></div>
                <div className="relative w-full h-full bg-white rounded-full shadow-pharmacy-lg flex items-center justify-center">
                  <div className="w-56 h-56 md:w-72 md:h-72 gradient-pharmacy rounded-full flex items-center justify-center">
                    <Pill className="w-32 h-32 md:w-40 md:h-40 text-white" strokeWidth={1.5} />
                  </div>
                </div>
                <div className="absolute top-4 right-4 w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center animate-bounce">
                  <HeartPulse className="w-8 h-8 text-red-500" />
                </div>
                <div className="absolute bottom-4 left-4 w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                  <ShieldCheck className="w-8 h-8 text-green-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us?</h2>
            <p className="text-muted-foreground">We provide the best pharmacy services with care and dedication</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="group p-6 bg-white rounded-2xl border border-border hover:shadow-pharmacy-lg transition-all hover:-translate-y-1">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-cyan-50/50 to-blue-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
            <p className="text-muted-foreground">Explore our wide range of healthcare products</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Link key={index} to="/products" className="group p-6 bg-white rounded-2xl border border-border hover:shadow-pharmacy transition-all hover:-translate-y-1 text-center">
                  <div className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count} products</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden gradient-pharmacy rounded-3xl p-8 md:p-16 text-center text-white">
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Need Medical Advice?</h2>
              <p className="text-lg mb-8 opacity-90">Our certified pharmacists are available 24/7 to help you with any questions about medications and health.</p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary rounded-xl font-semibold hover:scale-105 transition-all">
                  Browse Products
                  <ArrowRight className="w-5 h-5" />
                </Link>
                {!user && (
                  <Link to="/register" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-primary transition-all">
                    Get Started
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
