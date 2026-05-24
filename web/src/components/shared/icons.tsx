export function GithubIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.03c3.15-.38 6.5-1.54 6.5-7.17A5.8 5.8 0 0 0 19 5.3c.5-1.5.5-3.2-.5-4.3-1.3 0-3.2 1.3-4.5 2.2a14.1 14.1 0 0 0-4 0C8.7 2.3 6.8 1 5.5 1c-1 1.1-1 2.8-.5 4.3A5.8 5.8 0 0 0 3 9.8c0 5.6 3.3 6.8 6.5 7.17A4.8 4.8 0 0 0 8.5 20v2"></path>
    </svg>
  )
}
