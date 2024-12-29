import { User, Bell, Shield, Palette } from 'lucide-react';

const settingsSections = [
  {
    icon: User,
    title: 'Profile Settings',
    description: 'Update your account information and preferences'
  },
  {
    icon: Bell,
    title: 'Notification Settings',
    description: 'Configure how you receive alerts and updates'
  },
  {
    icon: Shield,
    title: 'Security Settings',
    description: 'Manage your password and security preferences'
  },
  {
    icon: Palette,
    title: 'Appearance',
    description: 'Customize the look and feel of your dashboard'
  }
];

export function Settings() {
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="p-8">
        <h1 className="text-2xl font-bold text-secondary-indigo mb-8">Settings</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {settingsSections.map((section) => (
            <div 
              key={section.title}
              className="bg-base p-6 rounded-xl shadow-sm border border-primary/10 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-secondary-gold/20 rounded-lg">
                  <section.icon className="w-6 h-6 text-secondary-gold" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-secondary-indigo">{section.title}</h3>
                  <p className="text-sm text-base-dark mt-1">{section.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}