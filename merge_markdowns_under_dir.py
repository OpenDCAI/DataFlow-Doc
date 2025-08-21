import os
import subprocess
import shutil

def markdown_to_pdf(directory):
    # 检查 Pandoc 是否可用
    if not shutil.which("pandoc"):
        raise FileNotFoundError("Pandoc 未安装或未在 PATH 中找到。")

    # 获取目录下的所有 Markdown 文件（递归）
    markdown_files = []
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.md'):
                markdown_files.append(os.path.join(root, file))
    
    # 排序文件（可选）
    markdown_files.sort()
    
    # 创建临时的合并 Markdown 文件
    temp_md_file = os.path.join(directory, 'merged.md')
    
    with open(temp_md_file, 'w', encoding='utf-8') as outfile:
        for md_file in markdown_files:
            with open(md_file, 'r', encoding='utf-8') as infile:
                outfile.write(infile.read() + '\n\n')

markdown_to_pdf(directory="./docs/notes/zh")