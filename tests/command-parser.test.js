import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import { InvalidArgument } from "../errors.js";
import CommandParser from "../parsers/command-parser.js";

describe("Windows platform", () => {
  let originalPathSep;
  let originalOsPlatform;
  let parser;

  before(() => {
    originalPathSep = path.sep;

    originalOsPlatform = os.platform;

    Object.defineProperty(path, "sep", { value: "\\" });

    Object.defineProperty(process, "platform", {
      value: "win32",
    });

    parser = new CommandParser();
  });

  after(() => {
    Object.defineProperty(path, "sep", { value: originalPathSep });

    Object.defineProperty(process, "platform", {
      value: originalOsPlatform,
    });

    parser = null;
  });
  describe("cat cmd", () => {
    describe("Valid inputs", () => {
      const validTestCases = [
        "C:\\Users\\John\\Documents\\\\file.txt",
        '"C:\\Program Files\\app\\config"',
        "D:\\Music\\..\\Artists\\Adele\\album.mp3",
        "'C:\\Users\\  J  ohn                 Weak\\Downloads\\image.png'",
        "C:\\Windows\\System32\\cmd.exe",
        "'C:\\Users\\Public\\Shared Documents\\report.docx'",
        "'C:\\My Folder\\My File.txt'",
        "F:\\Backup\\2024-10-04\\data.zip",
        "C:\\Temp\\notes.txt",
        "E:\\Videos\\2024\\presentation.mp4",
        "'C:\\Users\\John\\Documents\\ '",
        "Documents\\file.txt",
        "..\\Temp\\con.txt",
        "Projects\\..\\file.txt",
        "C:\\Users\\John\\..\\..\\Public\\file.txt",
        "..\\..\\Music\\Adele\\album.mp3",
        ".\\folder\\subfolder\\another_folder\\file.ext",
        "C:\\Users\\John\\Desktop\\Project\\..\\file_backup.bak",
        "'..\\My Projects\\report.docx'",
        "C:\\Users\\John\\Documents\\.hiddenfile",
        ".\\Scripts\\run.bat",
        "..\\..\\..\\Photos\\holiday.jpg",
        "C:\\Games\\Steam\\..\\Origin\\game.save",
        "'C:\\Some Folder\\..\\..\\file.txt'",
        "C:\\Users\\John\\Documents\\..\\Downloads\\anotherfile",
        "C:\\Projects\\MyProject\\..\\..\\file.txt",
        "..\\..\\..\\2024\\Events\\event.pdf",
        "\\\\Server\\SharedFolder\\file.txt",
        "\\\\192.168.1.1\\SharedFolder\\file.txt",
      ];

      validTestCases.forEach((testCase) => {
        it(`should parse valid path: ${testCase}`, () => {
          assert.doesNotThrow(() => {
            parser.parse("cat " + testCase);
          });
        });
      });
    });

    describe("Invalid inputs", () => {
      const invalidTestCases = [
        "",
        "C:     \\Windows\\System32\\cmd.exe",
        '"C:\\folder\\subfolder\\another_folder\\file.ext""',
        "C:\\Temp\\newfolder\\",
        "C:\\Users\\John\\file<>.txt",
        "C:\\Users\\John\\file.txt:",
        "C:\\Program Files\\|config.ini",
        "C:\\Users\\John\\file?.txt",
        "C:D:\\folder\\file.txt",
        "C:/Users/John\\file.txt",
        "C:\\Users  \\John\\file.txt",
        //didn't cover max length
        // "C:\\Users\\John\\Documents\\This\\is\\a\\very\\long\\path\\that\\exceeds\\the\\maximum\\length\\allowed\\by\\Windows\\for\\file\\names\\or\\folders.txt"
      ];

      invalidTestCases.forEach((testCase) => {
        it(`should not parse invalid path: ${testCase}`, () => {
          const error = new InvalidArgument(
            `Command "cat" has invalid arguments.`
          );
          assert.throws(() => {
            const r = parser.parse("cat " + testCase);
            console.log(r);
          }, error);
        });
      });
    });
  });
});

describe("Linux platform", () => {
  let originalPathSep;
  let originalOsPlatform;
  let parser;

  before(() => {
    originalPathSep = path.sep;
    originalOsPlatform = os.platform;

    Object.defineProperty(path, "sep", { value: "/" });

    Object.defineProperty(process, "platform", {
      value: "linux",
    });

    parser = new CommandParser();
  });

  after(() => {
    Object.defineProperty(path, "sep", { value: originalPathSep });

    Object.defineProperty(process, "platform", {
      value: originalOsPlatform,
    });
    parser = null;
  });
  describe("cat cmd", () => {
    describe("Valid inputs", () => {
      const validTestCases = [
        '"C:\\folder\\subfolder\\another_folder\\file.ext"',
        "/home/user/file.txt",
        "/var/log/system.log",
        "/usr/local/bin/executable",
        "/home/user/.../user2/file.txt",
        "file.txt",
        "./file.txt",
        "/home/user/.hiddenfile",
        "../file.txt",
        "'   .txt'",
        "'/va    r/lo   g/sys     tem.log'",
        "'./va    r/lo   g/sys     tem.log'",
        "/home/user/some_folder/another_folder/file.ext",
      ];

      validTestCases.forEach((testCase) => {
        it(`should parse valid path: ${testCase}`, () => {
          assert.doesNotThrow(() => parser.parse("cat " + testCase));
        });
      });
    });

    describe("Invalid inputs", () => {
      const invalidTestCases = [
        "",
        "/////////////////",
        "//",
        "/tmp/newfolder/",
        "/home/user/some_folder/another_folder/  file.ext",
      ];

      invalidTestCases.forEach((testCase) => {
        it(`should not parse invalid path: ${testCase}`, () => {
          const error = new InvalidArgument(
            `Command "cat" has invalid arguments.`
          );
          assert.throws(() => {
            parser.parse("cat " + testCase);
          }, error);
        });
      });
    });
  });
});
