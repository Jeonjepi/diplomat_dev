import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFiles, Bind, Res } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { multerDiskOptions } from 'src/multer.option';
import { ContentsService } from './contents.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@Controller('')
export class ContentsController {
  constructor(private readonly contentsService: ContentsService) {}

  @Get('/files')
  getfiles(@Query() queryString){
    return this.contentsService.getfiles(queryString); 
  }

  @Post('/uploadFile')
  @UseInterceptors(FileFieldsInterceptor([{name : 'file'}], multerDiskOptions))
  uploadFiles(@Body() reqBody, @UploadedFiles() file){
    console.log(reqBody)
    return this.contentsService.uploadFiles(reqBody, file)
  }

  @Delete('/files/:file_id')
  deleteFile(@Param() param){
    return this.contentsService.deleteFile(param)

  }

  @Get('/download/:category/:fileName')
  downloadFile(@Param() param, @Res() res){
    const {category, fileName} = param
    return res.download('/home/caitory/diplomat_upload')
  }
}
