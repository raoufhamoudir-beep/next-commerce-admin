import PageContainer from '@/components/ui/PageContainer';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface SocialLink {
  name: string;
  href: string;
  icon: string;
}

// Configuration: easy to edit links and images here
const SOCIAL_LINKS: SocialLink[] = [
  {
    name: "Facebook",
    href: "https://facebook.com", // Replace with actual URL
    icon: "https://f003.backblazeb2.com/file/flex-storage/3iCF2TDOxp3bPyLetMWqo-1732896223843.png",
  },
  {
    name: "Instagram",
    href: "https://instagram.com", // Replace with actual URL
    icon: "https://f003.backblazeb2.com/file/flex-storage/8e_Q6aE3kZjg0MF80AdBl-1732896223768.png",
  },
  {
    name: "Telegram",
    href: "https://telegram.org", // Replace with actual URL
    icon: "https://f003.backblazeb2.com/file/flex-storage/iIpdFi_ynEWVoUkKE7fTj-1732896163852.png",
  },
];

const Contact: React.FC = () => {
  // Ensure "constants" matches your translation file name (fixed typo from 'constanst')
  const { t } = useTranslation("constants"); 

  return (
  <PageContainer
  title="Contact us"
  about="fell free to text us in any sotail media "
  >

      <p className="text-gray-600 w-10/12 md:w-2/3 mx-auto text-sm text-center my-5 leading-relaxed">
        {t("contacttext")}
      </p>

      <div className="flex gap-5 justify-center items-center">
        {SOCIAL_LINKS.map((link, index) => (
          <a
          key={index}
          href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform hover:scale-110 duration-200"
            aria-label={`Visit our ${link.name} page`}
          >
            <img
              className="w-10 h-10 rounded-full object-cover shadow-sm hover:shadow-md"
              src={link.icon}
              alt={`${link.name} icon`}
              />
          </a>
        ))}
      </div>
      </PageContainer>
  );
};

export default Contact;