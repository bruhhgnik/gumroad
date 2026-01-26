import { usePage } from "@inertiajs/react";
import * as React from "react";

import { LoggedInUser, LoggedInUserProvider, parseLoggedInUser } from "$app/components/LoggedInUser";
import { WithContent, WithContentProps } from "$app/components/server-components/DownloadPage/WithContent";

type Props = WithContentProps & {
  smart_app_banner: { app_id: string; app_argument: string };
  dropbox_api_key: string | null;
  logged_in_user: LoggedInUser | null;
};

const DownloadPage = () => {
  const { smart_app_banner, dropbox_api_key, logged_in_user, ...props } = usePage<Props>().props;

  React.useEffect(() => {
    // Add smart app banner meta tag
    const existingMeta = document.querySelector('meta[name="apple-itunes-app"]');
    if (!existingMeta && smart_app_banner) {
      const meta = document.createElement("meta");
      meta.name = "apple-itunes-app";
      meta.content = `app-id=${smart_app_banner.app_id}, app-argument=${smart_app_banner.app_argument}`;
      document.head.appendChild(meta);

      return () => {
        meta.remove();
      };
    }
  }, [smart_app_banner]);

  React.useEffect(() => {
    // Load Dropbox dropins script
    if (dropbox_api_key && !document.getElementById("dropboxjs")) {
      const script = document.createElement("script");
      script.id = "dropboxjs";
      script.src = "https://www.dropbox.com/static/api/2/dropins.js";
      script.setAttribute("data-app-key", dropbox_api_key);
      document.body.appendChild(script);

      return () => {
        script.remove();
      };
    }
  }, [dropbox_api_key]);

  return (
    <LoggedInUserProvider value={parseLoggedInUser(logged_in_user)}>
      <WithContent {...props} />
    </LoggedInUserProvider>
  );
};

DownloadPage.disableLayout = true;
export default DownloadPage;
