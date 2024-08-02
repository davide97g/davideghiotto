import { Button, Card, CardFooter, Image } from "@nextui-org/react";

type ProjectColor =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | undefined;

type Project = {
  name: string;
  url: string;
  img?: string;
};
export default function Projects() {
  const getRandomColor = (): ProjectColor => {
    const colors = [
      "default",
      "primary",
      "secondary",
      "success",
      "warning",
      "error",
    ];
    return colors[Math.floor(Math.random() * colors.length)] as ProjectColor;
  };

  const randomColor = getRandomColor();

  const projects: Project[] = [
    {
      name: "RimScout App",
      url: "https://app.rimscoutup.it/",
      img: "rimscout-logo.png",
    },
    {
      name: "Pokèdle",
      url: "https://pokedle.online/",
      img: "pokedle-logo.png",
    },
    {
      name: "Crypto Trade",
      url: "https://github.com/davide97g/icrypto.trade",
    },
  ].sort(() => Math.random() - 0.5);

  return (
    <div className="flex flex-col gap-2 items-center">
      <h2 className="text-2xl font-bold">Projects</h2>
      <div className="flex flex-wrap gap-2 p-4 items-center justify-center">
        {projects.map((project) => (
          <Card
            key={project.name}
            isFooterBlurred
            radius="lg"
            className="border-none"
          >
            <Image
              alt="Woman listing to music"
              className="object-cover"
              height={200}
              src={project.img}
              width={200}
            />
            <CardFooter className="absolute bg-black/40 bottom-0 z-10  border-default-600 dark:border-default-100">
              <div className="flex flex-grow gap-2 items-center">
                <div className="flex flex-col">
                  <p className="text-tiny text-white/60">{project.name}</p>
                </div>
              </div>
              <Button
                color={randomColor}
                variant="light"
                radius="full"
                size="sm"
                onClick={() => window.open(project.url)}
              >
                Open
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
