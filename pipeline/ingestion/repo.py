from repomix import RepoProcessor


class RepoIngestor:
    def pack_remote(self, url: str) -> dict:
        processor = RepoProcessor(repo_url=url)
        result = processor.process(write_output=False)

        return {
            "content": result.output_content,
            "total_files": result.total_files,
            "total_tokens": result.total_tokens,
            "url": url,
        }

    def pack_local(self, path: str) -> dict:
        processor = RepoProcessor(path)
        result = processor.process(write_output=False)

        return {
            "content": result.output_content,
            "total_files": result.total_files,
            "total_tokens": result.total_tokens,
            "path": path,
        }
