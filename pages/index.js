import { useState, useEffect } from "react";
import MainGrid from "../src/components/MainGrid";
import Box from "../src/components/Box";
import {
	AlurakutMenu,
	AlurakutProfileSidebarMenuDefault,
	OrkutNostalgicIconSet,
} from "../src/lib/AlurakutCommons";
import { ProfileRelationsBoxWrapper } from "../src/components/ProfileRelations";

function ProfileSidebar(propriedades) {
	return (
		<Box as="aside">
			<img
				src={`https://github.com/${propriedades.githubUser}.png`}
				style={{ borderRadius: "8px" }}
			/>
			<hr />

			<p>
				<a
					className="boxLink"
					href={`https://github.com/${propriedades.githubUser}`}
				>
					@{propriedades.githubUser}
				</a>
			</p>
			<hr />

			<AlurakutProfileSidebarMenuDefault />
		</Box>
	);
}

export default function Home() {
	const usuarioAleatorio = "pedromatsubara";

	const [comunidades, setComunidades] = useState([]);
	const [maxComunidades, setMaxComunidades] = useState(6);

	const [filteredAlurakuteiros, setFilteredAlurakuteiros] = useState([]);
	const [maxAlurakuteiros, setMaxAlurakuteiros] = useState(6);
	const [alurakuteiros, setAlurakuteiros] = useState([
		"juunegreiros",
		"omariosouto",
		"peas",
		"rafaballerini",
		"marcobrunodev",
		"felipefialho",
	]);

	useEffect(() => {
		fetch(
			"https://raw.githubusercontent.com/alura-challenges/alurakut/main/README.md"
		)
			.then((data) => data.text())
			.then((data) => {
				const extractedNames = data
					.split(
						"/cf9f1db04b6e4e2b7a984902d69b889f717d09cb94b8b4296ffffc16d0c73120/"
					)
					.map((text) => text.split("/")[0]);
				extractedNames.shift();
				setAlurakuteiros(extractedNames);
				setFilteredAlurakuteiros(extractedNames);
			});

		fetch("https://graphql.datocms.com/", {
			method: "POST",
			headers: {
				Authorization: "a561001e679224adba2e060dc256e3",
				"Content-type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({
				query: `query {
					allCommunities {
						id
						title
						href
						imageUrl
					}
				}`,
			}),
		}).then(async (res) => {
			const { data } = await res.json();
			setComunidades(data.allCommunities.sort((a, b) => a.id - b.id));
		});
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();
		const dadosDoForm = new FormData(e.target);

		const novaCommunidade = {
			title: dadosDoForm.get("title"),
			href: dadosDoForm.get("href"),
			imageUrl: dadosDoForm.get("imageUrl"),
		};

		fetch("/api/comunidades", {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify(novaCommunidade),
		}).then(async (res) => {
			const data = await res.json();
			setComunidades([...comunidades, data.comunidadeCriada]);
		});
	};

	const handleAlurakuteirosFilter = (e) => {
		if (e.target.value === "") {
			setFilteredAlurakuteiros(alurakuteiros);
		} else {
			setFilteredAlurakuteiros(
				alurakuteiros.filter(
					(alurakuteiro) =>
						alurakuteiro
							.toLocaleLowerCase()
							.indexOf(e.target.value.toLocaleLowerCase()) !== -1
				)
			);
		}

		setMaxAlurakuteiros(6);
	};

	return (
		<>
			<AlurakutMenu githubUser={usuarioAleatorio} />
			<MainGrid>
				{/* <Box style="grid-area: profileArea;"> */}
				<div className="profileArea" style={{ gridArea: "profileArea" }}>
					<ProfileSidebar githubUser={usuarioAleatorio} />
				</div>
				<div className="welcomeArea" style={{ gridArea: "welcomeArea" }}>
					<Box>
						<h1 className="title">Bem vindo(a)</h1>

						<OrkutNostalgicIconSet />
					</Box>

					<Box>
						<h2 className="subTitle">O que você deseja fazer?</h2>
						<form onSubmit={(e) => handleSubmit(e)}>
							<div>
								<input
									placeholder="Qual vai ser o nome da sua comunidade?"
									name="title"
									aria-label="Qual vai ser o nome da sua comunidade?"
									type="text"
								/>
							</div>
							<div>
								<input
									placeholder="Coloque uma URL para usarmos de capa"
									name="imageUrl"
									aria-label="Coloque uma URL para usarmos de capa"
								/>
							</div>
							<div>
								<input
									placeholder="Coloque a URL de destino"
									name="href"
									aria-label="Coloque a URL de destino"
								/>
							</div>

							<button>Criar comunidade</button>
						</form>
					</Box>
				</div>
				<div
					className="profileRelationsArea"
					style={{ gridArea: "profileRelationsArea" }}
				>
					<ProfileRelationsBoxWrapper>
						<h2 className="smallTitle">Comunidades ({comunidades.length})</h2>
						<ul>
							{comunidades.slice(0, maxComunidades).map((itemAtual) => {
								return (
									<li key={itemAtual.id}>
										<a href={itemAtual.href}>
											<img src={itemAtual.imageUrl} />
											<span>{itemAtual.title}</span>
										</a>
									</li>
								);
							})}
						</ul>
						<button onClick={() => setMaxComunidades(maxComunidades + 6)}>
							Ver mais...
						</button>
					</ProfileRelationsBoxWrapper>
					<ProfileRelationsBoxWrapper>
						<h2 className="smallTitle">
							Pessoas da comunidade ({filteredAlurakuteiros.length})
						</h2>

						<div>
							<input
								onChange={(e) => handleAlurakuteirosFilter(e)}
								placeholder="Quem você procura?"
								name="filter"
								aria-label="Quem você procura?"
								type="text"
							/>
						</div>
						<ul>
							{filteredAlurakuteiros
								.slice(0, maxAlurakuteiros)
								.map((itemAtual) => {
									return (
										<li key={Math.random() + itemAtual}>
											<a
												href={`https://github.com/${itemAtual}`}
												target="_blank"
											>
												<img src={`https://github.com/${itemAtual}.png`} />
												<span>{itemAtual}</span>
											</a>
										</li>
									);
								})}
						</ul>
						<button onClick={() => setMaxAlurakuteiros(maxAlurakuteiros + 9)}>
							Ver mais...
						</button>
					</ProfileRelationsBoxWrapper>
				</div>
			</MainGrid>
		</>
	);
}
