// React, Next.js
import Image from "next/image";
import { FC } from "react";

// Logo image
import { cn } from "@/lib/utils";
import LogoImg from "../../../public/assets/icons/logo-1.png";

type LogoProps = {
  width: string;
  height: string;
};

const Logo: FC<LogoProps> = ({ width, height }) => {
  return (
    <div className={cn(`z-50 w-[${width}] h-[${height}]`)}>
      <Image
        src={LogoImg}
        alt="DP-Shop"
        className="w-full h-full object-cover overflow-visible"
      />
    </div>
  );
};

export default Logo;
