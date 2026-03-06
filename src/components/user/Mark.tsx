import { FaGithub } from "react-icons/fa";
import { BiLogoInstagramAlt } from "react-icons/bi";
import { FaLinkedin } from "react-icons/fa6";

export default function Mark() {
  return (
    <div className="p-3 bg-gray-900 rounded-md space-y-2">
      <section>
        <h2 className="text-gray-500 flex flex-wrap items-center gap-1">
          <span>Developed&nbsp;by</span>
          <span className="font-semibold text-white">Rahmat&nbsp;Tomy</span>

          <span>󠁯•󠁏</span>
          <div className="flex gap-1 items-center">
            <a
              href="https://github.com/tosrv"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub className="h-6 w-6 hover:text-white" />
            </a>
            <a
              href="https://www.instagram.com/rahmat_tomy"
              target="_blank"
              rel="noopener noreferrer"
            >
              <BiLogoInstagramAlt className="h-7 w-7 hover:text-white" />
            </a>
            <a
              href="https://www.linkedin.com/in/rahmat-tomy-apriliyanto-445a34382"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin className="h-6 w-6 hover:text-white" />
            </a>
          </div>
        </h2>
      </section>
      <section>
        <h3 className="text-gray-500 flex flex-wrap items-baseline gap-1">
          <span>Powered&nbsp;by</span>
          <span>
            <img
              src="https://dumbways.id/assets/images/brandv2.png"
              alt="dumbways"
              className="w-5"
            />
          </span>
          <a
            href="https://dumbways.id/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            Dumbways&nbsp;Indonesia
          </a>
          <span>󠁯•󠁏</span>
          <span>#1&nbsp;Coding&nbsp;Bootcamp</span>
        </h3>
      </section>
    </div>
  );
}
